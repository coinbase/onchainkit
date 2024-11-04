function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function formatAmount(num) {
  // If the number is not in scientific notation return it as it is
  if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    return num;
  }

  // Parse into coefficient and exponent
  const _num$toLowerCase$spli = num.toLowerCase().split('e'),
    _num$toLowerCase$spli2 = _slicedToArray(_num$toLowerCase$spli, 2),
    coefficient = _num$toLowerCase$spli2[0],
    exponent = _num$toLowerCase$spli2[1];
  const exp = Number.parseInt(exponent);

  // Split coefficient into integer and decimal parts
  const _coefficient$split = coefficient.split('.'),
    _coefficient$split2 = _slicedToArray(_coefficient$split, 2),
    intPart = _coefficient$split2[0],
    _coefficient$split2$ = _coefficient$split2[1],
    decPart = _coefficient$split2$ === void 0 ? '' : _coefficient$split2$;

  // Combine integer and decimal parts
  const fullNumber = intPart + decPart;

  // Calculate the new decimal point position
  const newPosition = intPart.length + exp;
  if (newPosition <= 0) {
    // If the new position is less than or equal to 0, we need to add leading zeros
    return `0.${'0'.repeat(Math.abs(newPosition))}${fullNumber}`;
  }
  if (newPosition >= fullNumber.length) {
    // If the new position is greater than the number length, we need to add trailing zeros
    return fullNumber + '0'.repeat(newPosition - fullNumber.length);
  }

  // Otherwise, we insert the decimal point at the new position
  return `${fullNumber.slice(0, newPosition)}.${fullNumber.slice(newPosition)}`;
}
export { formatAmount };
//# sourceMappingURL=formatAmount.js.map
