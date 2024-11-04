import { usePreferredColorScheme } from './internal/hooks/usePreferredColorScheme.js';
import { useOnchainKit } from './useOnchainKit.js';
function useTheme() {
  const preferredMode = usePreferredColorScheme();
  const _useOnchainKit = useOnchainKit(),
    _useOnchainKit$config = _useOnchainKit.config,
    _useOnchainKit$config2 = _useOnchainKit$config === void 0 ? {} : _useOnchainKit$config,
    appearance = _useOnchainKit$config2.appearance;
  const _ref = appearance || {},
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? 'default' : _ref$theme,
    _ref$mode = _ref.mode,
    mode = _ref$mode === void 0 ? 'auto' : _ref$mode;
  if (theme === 'cyberpunk' || theme === 'base' || theme === 'hacker') {
    return theme;
  }
  switch (mode) {
    case 'auto':
      return `${theme}-${preferredMode}`;
    case 'dark':
      return `${theme}-dark`;
    case 'light':
      return `${theme}-light`;
    default:
      // If mode is not set or is an invalid value, fall back to preferredMode
      return `${theme}-${preferredMode}`;
  }
}
export { useTheme };
//# sourceMappingURL=useTheme.js.map
