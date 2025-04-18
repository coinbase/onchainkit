import { NodePath } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import * as t from '@babel/types';

const HELPER_NAME = '__prefixClassNames';

function prefixStringLiteral(stringLiteral: string, prefix: string) {
  return stringLiteral.replace(
    // Match any non-whitespace characters that:
    // 1. Are at the start of the string (^) OR preceded by whitespace (\s)
    // 2. Don't already start with the prefix
    new RegExp(`(^|\\s)(?!${prefix})(\\S+)`, 'g'),
    `$1${prefix}$2 `,
  );
}

function processTemplateLiteral(
  templateLiteral: t.TemplateLiteral,
  prefix: string,
) {
  // For each quasi...
  templateLiteral.quasis.forEach((quasi, index) => {
    // ...if the quasi isn't an empty string...
    if (quasi.value.raw.length > 0) {
      const isFirstQuasi = index === 0;
      const prevQuasiString = templateLiteral.quasis[index - 1]?.value.raw;
      const prevEndsInWhitespace = /^\s$/.test(prevQuasiString?.at(-1) ?? '');

      // ...split the quasi into classes, filter out empty strings, and map each class to a prefixed class.
      const prefixed = quasi.value.raw
        .split(/\s+/)
        .filter(Boolean)
        .map((cls, i) => {
          const shouldPrefix =
            // If we're not at the first class in this quasi, we prefix.
            i !== 0 ||
            // If we're at the first quasi, we prefix.
            isFirstQuasi ||
            // If the previous quasi ends in whitespace, we prefix.
            prevEndsInWhitespace;

          // But only if the class doesn't already start with the prefix.
          if (shouldPrefix && !cls.startsWith(prefix)) {
            return `${prefix}${cls}`;
          }

          // Otherwise, we don't prefix.
          return cls;
        })
        .join(' ');

      // Update the quasi with the prefixed classes.
      quasi.value.raw = prefixed;
      quasi.value.cooked = prefixed;
    }
  });
}

export function babelPrefixReactClassNames({
  prefix,
  cnUtil = 'cn',
}: {
  prefix: string;
  cnUtil?: string | false;
}): ReturnType<typeof declare> {
  const helperFunction = t.functionDeclaration(
    t.identifier(HELPER_NAME),
    [t.identifier('value')],
    t.blockStatement([
      t.returnStatement(
        t.conditionalExpression(
          t.unaryExpression('!', t.identifier('value')),
          t.identifier('value'),
          t.conditionalExpression(
            t.binaryExpression(
              '===',
              t.unaryExpression('typeof', t.identifier('value')),
              t.stringLiteral('string'),
            ),
            t.callExpression(
              t.memberExpression(
                t.identifier('value'),
                t.identifier('replace'),
              ),
              [
                t.regExpLiteral(`(^|\\s)(?!${prefix})(\\S+)`, 'g'),
                t.stringLiteral(`$1${prefix}$2 `),
              ],
            ),
            t.binaryExpression(
              '+',
              t.stringLiteral(`${prefix} `),
              t.identifier('value'),
            ),
          ),
        ),
      ),
    ]),
  );

  return declare(({ types }) => {
    // Function to ensure the helper exists in the program
    const ensureHelperExists = (path: NodePath) => {
      const program = path.findParent((p) => p.isProgram());
      let helperExists = false;

      if (program) {
        program.traverse({
          FunctionDeclaration(funcPath) {
            if (funcPath.node.id && funcPath.node.id.name === HELPER_NAME) {
              helperExists = true;
            }
          },
        });

        if (!helperExists) {
          (program as NodePath<t.Program>).unshiftContainer(
            'body',
            helperFunction,
          );
        }
      }

      return types.identifier(HELPER_NAME);
    };

    // Function to create a runtime helper call
    const createHelperCall = (arg: t.Expression, path: NodePath) => {
      const helperIdentifier = ensureHelperExists(path);
      return types.callExpression(helperIdentifier, [arg]);
    };

    return {
      visitor: {
        JSXAttribute(path) {
          if (path.node.name.name !== 'className') return;

          const value = path.node.value;

          // Handle string literals
          if (types.isStringLiteral(value)) {
            value.value = prefixStringLiteral(value.value, prefix);
          }

          if (types.isJSXExpressionContainer(value)) {
            const expression = value.expression;

            // Handle template literals
            if (types.isTemplateLiteral(expression)) {
              processTemplateLiteral(expression, prefix);
            }

            // Handle identifiers and member expressions
            if (
              types.isIdentifier(expression) ||
              types.isMemberExpression(expression)
            ) {
              value.expression = createHelperCall(expression, path);
            }

            // Handle cnUtil function calls
            if (
              types.isCallExpression(expression) &&
              types.isIdentifier(expression.callee) &&
              expression.callee.name === cnUtil
            ) {
              expression.arguments = expression.arguments.map((arg) => {
                // Handle string literals within cnUtil
                if (types.isStringLiteral(arg)) {
                  return types.stringLiteral(
                    prefixStringLiteral(arg.value, prefix),
                  );
                }

                // Handle template literals within cnUtil
                if (types.isTemplateLiteral(arg)) {
                  processTemplateLiteral(arg, prefix);
                }

                // Handle identifiers and member expressions within cnUtil
                if (types.isIdentifier(arg) || types.isMemberExpression(arg)) {
                  return createHelperCall(arg, path);
                }

                return arg;
              });
            }
          }
        },
      },
    };
  });
}
