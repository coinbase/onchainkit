import { declare } from '@babel/helper-plugin-utils';
import * as t from '@babel/types';

const HELPER_NAME = '__prefixClass';

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
    const ensureHelperExists = (path: any) => {
      const program = path.findParent((p: any) => p.isProgram());
      let helperExists = false;

      if (program) {
        program.traverse({
          FunctionDeclaration(funcPath: any) {
            if (funcPath.node.id && funcPath.node.id.name === HELPER_NAME) {
              helperExists = true;
            }
          },
        });

        if (!helperExists) {
          program.unshiftContainer('body', helperFunction);
        }
      }

      return types.identifier(HELPER_NAME);
    };

    // Function to create a runtime helper call
    const createHelperCall = (arg: any, path: any) => {
      const helperIdentifier = ensureHelperExists(path);

      return types.callExpression(helperIdentifier, [arg]);
    };

    return {
      visitor: {
        JSXAttribute(path) {
          if (path.node.name.name !== 'className') return;

          const value = path.node.value;

          // Handle string literals directly in JSX className
          if (types.isStringLiteral(value)) {
            // Use a regex with the same pattern as the helper function
            value.value = value.value.replace(
              new RegExp(`(^|\\s)(?!${prefix})(\\S+)`, 'g'),
              `$1${prefix}$2 `,
            );
          }

          // Handle dynamic expressions in JSX className
          if (types.isJSXExpressionContainer(value)) {
            const expression = value.expression;

            // Handle template literals directly in className
            if (types.isTemplateLiteral(expression)) {
              value.expression = createHelperCall(expression, path);
            }

            // Handle identifiers directly in className
            if (types.isIdentifier(expression)) {
              value.expression = createHelperCall(expression, path);
            }

            // Handle member expressions directly in className
            if (types.isMemberExpression(expression)) {
              value.expression = createHelperCall(expression, path);
            }

            // Handle cnUtil function calls (like cn(...))
            if (
              types.isCallExpression(expression) &&
              types.isIdentifier(expression.callee) &&
              expression.callee.name === cnUtil
            ) {
              // Process each argument of the cnUtil function
              expression.arguments = expression.arguments.map((arg) => {
                // Skip falsey values
                if (
                  types.isNullLiteral(arg) ||
                  (types.isBooleanLiteral(arg) && arg.value === false) ||
                  (types.isIdentifier(arg) && arg.name === 'undefined')
                ) {
                  return arg;
                }

                // Simple string literals can be processed at compile time
                if (types.isStringLiteral(arg)) {
                  // Use a regex with the same pattern as the helper function
                  const prefixedClasses = arg.value.replace(
                    new RegExp(`(^|\\s)(?!${prefix})(\\S+)`, 'g'),
                    `$1${prefix}$2 `,
                  );
                  return types.stringLiteral(prefixedClasses);
                }

                // For all dynamic expressions, use the helper function
                if (
                  types.isTemplateLiteral(arg) ||
                  types.isIdentifier(arg) ||
                  types.isMemberExpression(arg)
                ) {
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
