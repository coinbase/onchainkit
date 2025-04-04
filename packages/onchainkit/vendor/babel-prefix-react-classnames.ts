import { declare } from '@babel/helper-plugin-utils';

export function babelPrefixReactClassNames({
  prefix,
  cnUtil = 'cn',
}: {
  prefix: string;
  cnUtil?: string | false;
}): ReturnType<typeof declare> {
  return declare(({ types }) => {
    return {
      visitor: {
        JSXAttribute(path) {
          if (path.node.name.name !== 'className') return;

          const value = path.node.value;

          // Handle string literals
          if (types.isStringLiteral(value)) {
            const prefixedClasses = value.value
              .split(' ')
              .map((cls) => `${prefix}${cls}`)
              .join(' ');
            value.value = prefixedClasses;
          }

          // Handle cnUtil function calls
          if (types.isJSXExpressionContainer(value)) {
            const expression = value.expression;
            if (
              types.isCallExpression(expression) &&
              types.isIdentifier(expression.callee) &&
              expression.callee.name === cnUtil
            ) {
              // Process each argument of the cnUtil function
              expression.arguments = expression.arguments.map((arg) => {
                if (types.isStringLiteral(arg)) {
                  // Handle string literals within cnUtil
                  const prefixedClasses = arg.value
                    .split(/\s+/)
                    .map((cls) => `${prefix}${cls}`)
                    .join(' ');
                  return types.stringLiteral(prefixedClasses);
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
