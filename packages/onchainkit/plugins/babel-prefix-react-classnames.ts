/* eslint-disable complexity */
import { declare } from '@babel/helper-plugin-utils';
import * as t from '@babel/types';
import { prefixStringParts } from '../src/internal/utils/prefixStringParts';

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

      const prefixed = quasi.value.raw.replace(
        /(?:^\S)|(?:\s\S)/g,
        (match, index, str) => {
          const rest = str.substring(index).trim();

          // If the rest of the string starts with the prefix, we don't need to prefix.
          if (rest.startsWith(prefix)) return match;

          const startsWithWhitespace = /^\s/.test(match);

          // If we're not at the first quasi,
          // and we're starting with a non-whitespace character,
          // we want to check if the previous quasi ended in whitespace.
          // If it didn't, we don't want to prefix since we're part of the same class.
          if (!isFirstQuasi && !startsWithWhitespace && !prevEndsInWhitespace) {
            return match;
          }

          const prefixed = prefix + match.trim();

          return startsWithWhitespace ? ` ${prefixed}` : prefixed;
        },
      );

      // Update the quasi with the prefixed classes.
      quasi.value.raw = prefixed;
      quasi.value.cooked = prefixed;
    }
  });
}

export function babelPrefixReactClassNames({
  prefix,
  cnUtil = 'cn',
  universalClass,
}: {
  prefix: string;
  cnUtil?: string | false;
  universalClass?: string;
}): ReturnType<typeof declare> {
  return declare(({ types }) => {
    return {
      visitor: {
        JSXOpeningElement(path) {
          // Only process if universalClass is defined
          if (!universalClass) return;

          // Only add to HTML elements (lowercase tag names)
          if (!types.isJSXIdentifier(path.node.name)) return;
          if (!/^[a-z]/.test(path.node.name.name)) return;

          // Check if element already has a className attribute
          const hasClassName = path.node.attributes.some(
            (attr) =>
              types.isJSXAttribute(attr) &&
              types.isJSXIdentifier(attr.name) &&
              attr.name.name === 'className',
          );

          // If no className, add one with just the universal class
          if (!hasClassName) {
            const prefixedUniversalClass = `${prefix}${universalClass}`;
            path.node.attributes.push(
              types.jsxAttribute(
                types.jsxIdentifier('className'),
                types.stringLiteral(prefixedUniversalClass),
              ),
            );
          }
        },
        JSXAttribute(path) {
          if (path.node.name.name !== 'className') return;

          const value = path.node.value;

          // Check if this className is on an HTML element (lowercase tag)
          const parent = path.parent;
          const isHTMLElement =
            types.isJSXOpeningElement(parent) &&
            types.isJSXIdentifier(parent.name) &&
            /^[a-z]/.test(parent.name.name);

          // Handle string literals
          if (types.isStringLiteral(value)) {
            value.value = prefixStringParts(value.value, prefix);
            // Add universal class only to HTML elements
            if (universalClass && isHTMLElement) {
              const prefixedUniversalClass = `${prefix}${universalClass}`;
              if (!value.value.includes(prefixedUniversalClass)) {
                value.value = `${value.value} ${prefixedUniversalClass}`;
              }
            }
          }

          if (types.isJSXExpressionContainer(value)) {
            const expression = value.expression;

            // Handle template literals
            if (types.isTemplateLiteral(expression)) {
              processTemplateLiteral(expression, prefix);
              // Add universal class only to HTML elements
              if (universalClass && isHTMLElement) {
                const prefixedUniversalClass = `${prefix}${universalClass}`;
                // Add as last quasi
                const lastQuasi =
                  expression.quasis[expression.quasis.length - 1];
                if (
                  lastQuasi &&
                  !lastQuasi.value.raw.includes(prefixedUniversalClass)
                ) {
                  lastQuasi.value.raw = `${lastQuasi.value.raw} ${prefixedUniversalClass}`;
                  lastQuasi.value.cooked = lastQuasi.value.raw;
                }
              }
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
                    prefixStringParts(arg.value, prefix),
                  );
                }

                // Handle template literals within cnUtil
                if (types.isTemplateLiteral(arg)) {
                  processTemplateLiteral(arg, prefix);
                }

                // Handle conditional classes such as `isActive && "some-class"`
                if (types.isLogicalExpression(arg)) {
                  if (types.isStringLiteral(arg.right)) {
                    return types.logicalExpression(
                      arg.operator,
                      arg.left,
                      types.stringLiteral(
                        prefixStringParts(arg.right.value, prefix),
                      ),
                    );
                  }
                  if (types.isTemplateLiteral(arg.right)) {
                    processTemplateLiteral(arg.right, prefix);
                  }
                }

                // Handle conditional expressions (ternary operators) such as `isActive ? "class1" : "class2"`
                if (types.isConditionalExpression(arg)) {
                  if (types.isStringLiteral(arg.consequent)) {
                    arg.consequent = types.stringLiteral(
                      prefixStringParts(arg.consequent.value, prefix),
                    );
                  }
                  if (types.isStringLiteral(arg.alternate)) {
                    arg.alternate = types.stringLiteral(
                      prefixStringParts(arg.alternate.value, prefix),
                    );
                  }
                  if (types.isTemplateLiteral(arg.consequent)) {
                    processTemplateLiteral(arg.consequent, prefix);
                  }
                  if (types.isTemplateLiteral(arg.alternate)) {
                    processTemplateLiteral(arg.alternate, prefix);
                  }
                }

                // Leave identifiers and member expressions untouched
                return arg;
              });

              // Add universal class only to HTML elements
              if (universalClass && isHTMLElement) {
                const prefixedUniversalClass = `${prefix}${universalClass}`;
                expression.arguments.push(
                  types.stringLiteral(prefixedUniversalClass),
                );
              }
            }
          }

          // Handle elements without className - add it if it's an HTML element
          /* c8 ignore next 4 */
          if (!value && universalClass && isHTMLElement) {
            const prefixedUniversalClass = `${prefix}${universalClass}`;
            path.node.value = types.stringLiteral(prefixedUniversalClass);
          }
        },
      },
    };
  });
}
