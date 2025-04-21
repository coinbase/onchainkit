import * as PostCSS from 'postcss';

type FileMatcher = string | RegExp | Array<string | RegExp>;

export default function postcssPrefixClassnames({
  prefix,
  includeFiles,
  excludeFiles,
}: {
  prefix: string;
  includeFiles?: FileMatcher;
  excludeFiles?: FileMatcher;
}): PostCSS.Plugin {
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

function prefixClasses({
  selector,
  prefix,
}: {
  selector: string;
  prefix: string;
}) {
  return selector.replace(/(^\.)|((?:[^\\])\.)/g, (match) => {
    return match + prefix;
  });
}

function shouldProcessFile({
  file,
  includeFiles,
  excludeFiles,
}: {
  file: string;
  includeFiles?: FileMatcher;
  excludeFiles?: FileMatcher;
}) {
  if (!includeFiles && !excludeFiles) return true;
  if (excludeFiles && isMatch({ file, matcher: excludeFiles })) return false;
  if (includeFiles && isMatch({ file, matcher: includeFiles })) return true;
  return false;
}

function isMatch({
  file,
  matcher,
}: {
  file: string;
  matcher: FileMatcher;
}): boolean {
  if (typeof matcher === 'string') return file.endsWith(matcher);
  if (matcher instanceof RegExp) return matcher.test(file);
  if (Array.isArray(matcher))
    return matcher.some((m) => isMatch({ file, matcher: m }));
  return false;
}
