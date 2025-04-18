/**
 * PostCSS plugin that prefixes class names in CSS
 * @param {Object} options - Configuration options
 * @param {string} options.prefix - The prefix to add to class names
 * @param {(string[]|RegExp|string)} [options.includeFiles] - Files to include
 * @param {(string[]|RegExp|string)} [options.excludeFiles] - Files to exclude
 * @returns {Object} PostCSS plugin
 */
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

/**
 * Prefixes classes in a CSS selector
 * @param {Object} options - Options
 * @param {string} options.selector - The CSS selector
 * @param {string} options.prefix - The prefix to add
 * @returns {string} The prefixed selector
 */
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

/**
 * Determines if a file should be processed based on include/exclude patterns
 * @param {Object} options - Options
 * @param {string} options.file - The file path
 * @param {(string[]|RegExp|string)} [options.includeFiles] - Files to include
 * @param {(string[]|RegExp|string)} [options.excludeFiles] - Files to exclude
 * @returns {boolean} Whether the file should be processed
 */
function shouldProcessFile({ file, includeFiles, excludeFiles }) {
  if (!includeFiles && !excludeFiles) return true;
  if (excludeFiles && isMatch({ file, matcher: excludeFiles })) return false;
  if (includeFiles && isMatch({ file, matcher: includeFiles })) return true;
  return false;
}

/**
 * Checks if a file matches a pattern
 * @param {Object} options - Options
 * @param {string} options.file - The file path
 * @param {(string|RegExp|string[])} options.matcher - Pattern to match against
 * @returns {boolean} Whether the file matches the pattern
 */
function isMatch({ file, matcher }) {
  if (typeof matcher === 'string') return file.endsWith(matcher);
  if (matcher instanceof RegExp) return matcher.test(file);
  if (Array.isArray(matcher))
    return matcher.some((m) => isMatch({ file, matcher: m }));
  return false;
}
