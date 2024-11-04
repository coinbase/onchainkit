function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useEffect } from 'react';

// Tailwind breakpoints
const BREAKPOINTS = {
  sm: '(max-width: 640px)',
  md: '(min-width: 641px) and (max-width: 768px)',
  lg: '(min-width: 769px) and (max-width: 1023px)',
  xl: '(min-width: 1024px) and (max-width: 1279px)',
  '2xl': '(min-width: 1280px)'
};
function useBreakpoints() {
  const _useState = useState(undefined),
    _useState2 = _slicedToArray(_useState, 2),
    currentBreakpoint = _useState2[0],
    setCurrentBreakpoint = _useState2[1];

  // handles SSR case where window would be undefined,
  // once component mounts on client, hook sets correct breakpoint
  useEffect(() => {
    // get the current breakpoint based on media queries
    const getCurrentBreakpoint = () => {
      const entries = Object.entries(BREAKPOINTS);
      for (const _ref of entries) {
        var _ref2 = _slicedToArray(_ref, 2);
        const key = _ref2[0];
        const query = _ref2[1];
        if (window.matchMedia(query).matches) {
          return key;
        }
      }
      return 'md';
    };

    // set initial breakpoint
    setCurrentBreakpoint(getCurrentBreakpoint());

    // listen changes in the window size
    const handleResize = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return currentBreakpoint;
}
export { useBreakpoints };
//# sourceMappingURL=useBreakpoints.js.map
