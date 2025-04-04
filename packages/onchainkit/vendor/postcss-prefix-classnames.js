export default function postcssPrefixClassnames({
  prefix,
  includeFiles,
  excludeFiles,
}) {
  const rawPrefix = prefix.replace(/^(\.)/, '');

  return {
    postcssPlugin: 'postcss-prefix-classnames',
    prepare(result) {
      const file = result.root.source?.input.file;

      return {
        Rule(rule) {
          if (!file || !shouldProcessFile({ file, includeFiles, excludeFiles }))
            return;

          rule.selectors = rule.selectors.map((selector) => {
            return prefixClasses({ selector, prefix: rawPrefix });
          });
        },
      };
    },
  };
}

function prefixClasses({ selector, prefix }) {
  // Split the selector into parts to handle each class separately
  return selector.replace(/(\.)([^\s.:]+)/g, (_match, dot, className) => {
    // If the class already starts with the prefix, leave it as is
    if (className.startsWith(prefix)) {
      return dot + className;
    }
    // Otherwise, add the prefix to the class
    return dot + prefix + className;
  });
}

function shouldProcessFile({ file, includeFiles, excludeFiles }) {
  if (!includeFiles && !excludeFiles) return true;
  if (excludeFiles && isMatch({ file, matcher: excludeFiles })) return false;
  if (includeFiles && isMatch({ file, matcher: includeFiles })) return true;
  return false;
}

function isMatch({ file, matcher }) {
  if (typeof matcher === 'string') return file.endsWith(matcher);
  if (matcher instanceof RegExp) return matcher.test(file);
  if (Array.isArray(matcher))
    return matcher.some((m) => isMatch({ file, matcher: m }));
  return false;
}
