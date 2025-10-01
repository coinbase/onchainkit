/* eslint-disable complexity */
import postcss, { type PluginCreator, type Rule, type AtRule } from 'postcss';

interface PostCSSScopeToClassOptions {
  scopeClass?: string;
  consolidateLayers?: boolean;
}

const postcssCreateScopedStyles: PluginCreator<PostCSSScopeToClassOptions> = (
  options: PostCSSScopeToClassOptions = {},
) => {
  const { scopeClass = '.ock\\:el', consolidateLayers = false } = options;

  return {
    postcssPlugin: 'postcss-create-scoped-styles',
    prepare() {
      return {
        Root(root) {
          // First pass: collect and consolidate layers if enabled
          if (consolidateLayers) {
            consolidateAllLayers(root);
          }

          // Move @import rules to the top of the file
          moveImportsToTop(root);

          // Collect all keyframe names before transformation
          const keyframeNames = new Set<string>();
          root.walkAtRules('keyframes', (atRule) => {
            keyframeNames.add(atRule.params);
          });

          // Second pass: transform selectors and variable references
          root.walkRules((rule) => {
            // Transform :root rules specially
            if (rule.selector === ':root' || rule.selector === ':root, :host') {
              transformRootRule(rule, keyframeNames);
            } else if (isInsideAtRule(rule, ['keyframes', 'document'])) {
              // Skip selector transformation for keyframes and document rules,
              // but still transform variable references
              rule.walkDecls((decl) =>
                transformVariableReferences(decl, keyframeNames),
              );
            } else if (isInsideAtRule(rule, ['supports'])) {
              // For @supports rules, transform variables but handle selectors carefully
              transformRuleInSupports(rule, scopeClass, keyframeNames);
            } else {
              // Transform other global selectors
              transformGlobalSelector(rule, scopeClass);

              // Transform variable references in all rules
              rule.walkDecls((decl) =>
                transformVariableReferences(decl, keyframeNames),
              );
            }
          });

          // Third pass: transform variable references in at-rules (like @supports)
          root.walkAtRules((atRule) => {
            // Transform @property rule names to use --ock- prefix
            if (
              atRule.name === 'property' &&
              atRule.params.startsWith('--') &&
              !atRule.params.startsWith('--ock-')
            ) {
              atRule.params = `--ock-${atRule.params.slice(2)}`;
            }

            // Transform @keyframes names to use ock- prefix
            if (
              atRule.name === 'keyframes' &&
              !atRule.params.startsWith('ock-')
            ) {
              atRule.params = `ock-${atRule.params}`;
            }

            atRule.walkDecls((decl) =>
              transformVariableReferences(decl, keyframeNames),
            );
          });
        },
      };
    },
  };
};

function moveImportsToTop(root: postcss.Root) {
  const imports: postcss.AtRule[] = [];

  // Collect all @import rules
  root.walkAtRules('import', (atRule) => {
    imports.push(atRule.clone());
    atRule.remove();
  });

  // Add imports at the beginning of the file with proper formatting
  if (imports.length > 0) {
    // Process imports in reverse order since we're prepending
    for (let i = imports.length - 1; i >= 0; i--) {
      const importRule = imports[i];

      // Set the raws for this specific import
      if (i === 0) {
        // First import (will be at the top after prepend)
        importRule.raws.before = '';
        importRule.raws.after = ';'; // Ensure semicolon
      } else {
        // Other imports
        importRule.raws.before = '';
        importRule.raws.after = ';\n'; // Semicolon + newline
      }

      root.prepend(importRule);
    }

    // Add spacing after all imports by modifying the next node
    if (root.nodes.length > imports.length) {
      const firstNonImport = root.nodes[imports.length];
      if (firstNonImport) {
        firstNonImport.raws.before = '\n\n';
      }
    }
  }
}

function consolidateAllLayers(root: postcss.Root) {
  const layerOrder = ['properties', 'theme', 'base', 'utilities'];
  const layerContents: Record<string, postcss.ChildNode[]> = {};
  const layerDeclarations: AtRule[] = [];

  // First pass: collect all layer contents and remove layer at-rules
  root.walk((node) => {
    if (node.type === 'atrule' && node.name === 'layer') {
      if (node.params && !node.params.includes(',')) {
        // Single layer with content
        const layerName = node.params.trim();
        if (layerOrder.includes(layerName)) {
          if (!layerContents[layerName]) {
            layerContents[layerName] = [];
          }
          // Move all children to our collection
          node.each((child) => {
            layerContents[layerName].push(child.clone());
          });
          node.remove();
        }
      } else if (node.params && !node.nodes) {
        // Layer declaration without content (e.g., @layer theme, base, utilities;)
        layerDeclarations.push(node);
        node.remove();
      }
    }
  });

  // Create single consolidated layer with all content in correct order
  if (Object.keys(layerContents).length > 0) {
    const consolidatedLayer = postcss.atRule({
      name: 'layer',
      params: 'onchainkit',
    });

    // Add contents in the correct order with section comments
    layerOrder.forEach((layerName) => {
      if (layerContents[layerName]) {
        // Add section comment
        const comment = postcss.comment({
          text: ` ${layerName.charAt(0).toUpperCase() + layerName.slice(1)} section `,
        });
        consolidatedLayer.append(comment);

        // Add all rules from this layer
        layerContents[layerName].forEach((node) => {
          consolidatedLayer.append(node);
        });
      }
    });

    // Insert the consolidated layer at the beginning of the file
    root.prepend(consolidatedLayer);
  }
}

function isInsideAtRule(rule: Rule, atRuleNames: string[]): boolean {
  let parent = rule.parent;
  while (parent && parent.type !== 'root') {
    if (
      parent.type === 'atrule' &&
      atRuleNames.includes((parent as AtRule).name)
    ) {
      return true;
    }
    parent = parent.parent as typeof rule.parent | undefined;
  }
  return false;
}

function transformRootRule(rule: Rule, keyframeNames: Set<string>) {
  // Transform all variables to have --ock- prefix and keep them on :root
  rule.walkDecls((decl) => {
    // If variable doesn't already have --ock- prefix, add it
    if (decl.prop.startsWith('--') && !decl.prop.startsWith('--ock-')) {
      decl.prop = `--ock-${decl.prop.slice(2)}`; // Remove existing -- and add --ock-
    }

    // Also transform variable references in the value
    transformVariableReferences(decl, keyframeNames);
  });
}

function transformVariableReferences(
  decl: postcss.Declaration,
  keyframeNames: Set<string>,
) {
  // Transform var(--variable-name) references to use --ock- prefix
  if (decl.value.includes('var(--') && !decl.value.includes('var(--ock-')) {
    decl.value = decl.value.replace(
      /var\((--[a-zA-Z0-9-]+)(?:,([^)]*))?\)/g,
      (match, varName, fallback) => {
        // If the variable doesn't already have --ock- prefix, add it
        if (!varName.startsWith('--ock-')) {
          const prefixedVar = `--ock-${varName.slice(2)}`;
          return fallback
            ? `var(${prefixedVar}, ${fallback})`
            : `var(${prefixedVar})`;
        }
        return match; // Return unchanged if already prefixed
      },
    );
  }

  // Transform animation references to use ock- prefix
  transformAnimationReferences(decl, keyframeNames);
}

function transformAnimationReferences(
  decl: postcss.Declaration,
  keyframeNames: Set<string>,
) {
  // Transform animation and animation-name properties to use ock- prefix
  // But skip values that use var() since those are handled by variable reference transformation
  if (
    (decl.prop === 'animation' || decl.prop === 'animation-name') &&
    !decl.value.includes('var(')
  ) {
    // Handle animation values that reference keyframes directly
    for (const keyframe of keyframeNames) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${keyframe}\\b`, 'g');
      if (regex.test(decl.value) && !decl.value.includes(`ock-${keyframe}`)) {
        decl.value = decl.value.replace(regex, `ock-${keyframe}`);
      }
    }
  }

  // Also handle CSS variable values that contain keyframe references
  // This includes both --ock- prefixed and non-prefixed variables
  if (decl.prop.startsWith('--') && decl.prop.includes('animate')) {
    for (const keyframe of keyframeNames) {
      const regex = new RegExp(`\\b${keyframe}\\b`, 'g');
      if (regex.test(decl.value) && !decl.value.includes(`ock-${keyframe}`)) {
        decl.value = decl.value.replace(regex, `ock-${keyframe}`);
      }
    }
  }
}

function transformRuleInSupports(
  rule: Rule,
  scopeClass: string,
  keyframeNames: Set<string>,
) {
  // Transform variable declarations in @supports rules
  rule.walkDecls((decl) => {
    // Transform variable declarations to have --ock- prefix
    if (decl.prop.startsWith('--') && !decl.prop.startsWith('--ock-')) {
      decl.prop = `--ock-${decl.prop.slice(2)}`;
    }

    // Transform variable references
    transformVariableReferences(decl, keyframeNames);
  });

  // Transform selectors in @supports rules to be scoped
  transformGlobalSelector(rule, scopeClass);
}

function transformGlobalSelector(rule: Rule, scopeClass: string) {
  // Skip selectors that are already scoped with .ock: prefix
  if (rule.selector.includes('.ock\\:') || rule.selector.includes('ock:')) {
    return;
  }

  // Skip theme selectors - they should remain global to work with html[data-ock-theme]
  if (rule.selector.includes('[data-ock-theme')) {
    return;
  }

  // Transform global selectors to be scoped
  rule.selector = splitSelectors(rule.selector)
    .map((selector) => {
      const trimmed = selector.trim();

      // Transform common global selectors
      if (trimmed === '*') {
        return scopeClass;
      }

      if (
        trimmed === '::before' ||
        trimmed === '::after' ||
        trimmed === '::backdrop' ||
        trimmed === '::file-selector-button'
      ) {
        return `${scopeClass}${trimmed}`;
      }

      // Transform functional pseudo-classes like ':where()', ':is()', ':not()', etc.
      // These should be combined directly with scope class without modifying their internal content
      if (
        trimmed.startsWith(':where(') ||
        trimmed.startsWith(':is(') ||
        trimmed.startsWith(':not(') ||
        trimmed.startsWith(':has(')
      ) {
        return `${scopeClass}${trimmed}`;
      }

      // Transform pure pseudo-selectors and pseudo-elements like ':-moz-focusring', '::-moz-placeholder', etc.
      if (trimmed.startsWith('::') || trimmed.startsWith(':')) {
        return `${scopeClass}${trimmed}`;
      }

      // Special handling for html and :host selectors - these should apply to .ock:el directly
      if (trimmed === 'html' || trimmed === ':host') {
        return scopeClass;
      }

      // Transform element selectors like 'body', 'hr', 'h1', 'h2', etc.
      if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(trimmed)) {
        return `${trimmed}:where(${scopeClass})`; // Use :where() to avoid specificity issues
      }

      // Transform element selectors with pseudo-selectors like 'abbr:where([title])', 'input:where([type="button"])', etc.
      const elementWithPseudoMatch = trimmed.match(
        /^([a-zA-Z][a-zA-Z0-9]*)(.*)$/,
      );
      if (elementWithPseudoMatch && /^[a-zA-Z]/.test(trimmed)) {
        const [, elementName, pseudoPart] = elementWithPseudoMatch;
        // Check if the pseudo part contains typical pseudo-selectors
        if (
          pseudoPart &&
          (pseudoPart.startsWith(':') || pseudoPart.startsWith('['))
        ) {
          return `${elementName}:where(${scopeClass})${pseudoPart}`;
        }
      }

      // Transform more complex selectors that start with elements (fallback for other patterns)
      if (/^[a-zA-Z]/.test(trimmed)) {
        return `${scopeClass} ${trimmed}`;
      }

      // For other selectors, scope them as descendants
      return `${scopeClass} ${trimmed}`;
    })
    .join(', ');
}

function splitSelectors(selector: string): string[] {
  const selectors: string[] = [];
  let current = '';
  let depth = 0;
  let inParens = false;

  for (let i = 0; i < selector.length; i++) {
    const char = selector[i];

    if (char === '(') {
      depth++;
      inParens = true;
    } else if (char === ')') {
      depth--;
      if (depth === 0) {
        inParens = false;
      }
    }

    if (char === ',' && depth === 0 && !inParens) {
      // This comma is not inside parentheses, so it's a real selector separator
      selectors.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last selector
  if (current.trim()) {
    selectors.push(current.trim());
  }

  return selectors;
}

// Required for PostCSS v8+
postcssCreateScopedStyles.postcss = true;

export default postcssCreateScopedStyles;
