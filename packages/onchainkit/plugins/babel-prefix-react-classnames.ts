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

function addElementClass(
  jsxElement: t.JSXElement,
  className: string,
  types: typeof t,
) {
  const openingElement = jsxElement.openingElement;

  // Find existing className attribute
  const classNameAttr = openingElement.attributes.find(
    (attr): attr is t.JSXAttribute =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === 'className',
  );

  if (classNameAttr && t.isStringLiteral(classNameAttr.value)) {
    // Add to existing className string
    const currentClasses = classNameAttr.value.value;
    if (!currentClasses.includes(className)) {
      classNameAttr.value.value = currentClasses
        ? `${currentClasses} ${className}`
        : className;
    }
  } else if (classNameAttr && t.isJSXExpressionContainer(classNameAttr.value)) {
    // Handle existing JSX expression (like cn() calls)
    const expression = classNameAttr.value.expression;
    if (t.isCallExpression(expression)) {
      // Add as first argument to function call
      expression.arguments.unshift(types.stringLiteral(className));
    }
  } else {
    // Create new className attribute
    openingElement.attributes.push(
      types.jsxAttribute(
        types.jsxIdentifier('className'),
        types.stringLiteral(className),
      ),
    );
  }
}

export function babelPrefixReactClassNames({
  prefix,
  cnUtil = 'cn',
  addUniversalClass = false,
}: {
  prefix: string;
  cnUtil?: string | false;
  addUniversalClass?: boolean;
}): ReturnType<typeof declare> {
  return declare(({ types }) => {
    return {
      visitor: {
        JSXElement(path) {
          // Add universal "el" class to all JSX elements when enabled
          if (addUniversalClass) {
            addElementClass(path.node, 'el', types);
          }
        },
        JSXAttribute(path) {
          if (path.node.name.name !== 'className') return;

          const value = path.node.value;

          // Handle string literals
          if (types.isStringLiteral(value)) {
            value.value = prefixStringParts(value.value, prefix);
          }

          if (types.isJSXExpressionContainer(value)) {
            const expression = value.expression;

            // Handle template literals
            if (types.isTemplateLiteral(expression)) {
              processTemplateLiteral(expression, prefix);
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
            }
          }
        },
      },
    };
  });
}
