"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/atomic-sleep";
exports.ids = ["vendor-chunks/atomic-sleep"];
exports.modules = {

/***/ "(ssr)/./node_modules/atomic-sleep/index.js":
/*!********************************************!*\
  !*** ./node_modules/atomic-sleep/index.js ***!
  \********************************************/
/***/ ((module) => {

eval("\n\n/* global SharedArrayBuffer, Atomics */\n\nif (typeof SharedArrayBuffer !== 'undefined' && typeof Atomics !== 'undefined') {\n  const nil = new Int32Array(new SharedArrayBuffer(4))\n\n  function sleep (ms) {\n    // also filters out NaN, non-number types, including empty strings, but allows bigints\n    const valid = ms > 0 && ms < Infinity \n    if (valid === false) {\n      if (typeof ms !== 'number' && typeof ms !== 'bigint') {\n        throw TypeError('sleep: ms must be a number')\n      }\n      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')\n    }\n\n    Atomics.wait(nil, 0, 0, Number(ms))\n  }\n  module.exports = sleep\n} else {\n\n  function sleep (ms) {\n    // also filters out NaN, non-number types, including empty strings, but allows bigints\n    const valid = ms > 0 && ms < Infinity \n    if (valid === false) {\n      if (typeof ms !== 'number' && typeof ms !== 'bigint') {\n        throw TypeError('sleep: ms must be a number')\n      }\n      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')\n    }\n    const target = Date.now() + Number(ms)\n    while (target > Date.now()){}\n  }\n\n  module.exports = sleep\n\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYXRvbWljLXNsZWVwL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC8uL25vZGVfbW9kdWxlcy9hdG9taWMtc2xlZXAvaW5kZXguanM/NWI4NiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLyogZ2xvYmFsIFNoYXJlZEFycmF5QnVmZmVyLCBBdG9taWNzICovXG5cbmlmICh0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBdG9taWNzICE9PSAndW5kZWZpbmVkJykge1xuICBjb25zdCBuaWwgPSBuZXcgSW50MzJBcnJheShuZXcgU2hhcmVkQXJyYXlCdWZmZXIoNCkpXG5cbiAgZnVuY3Rpb24gc2xlZXAgKG1zKSB7XG4gICAgLy8gYWxzbyBmaWx0ZXJzIG91dCBOYU4sIG5vbi1udW1iZXIgdHlwZXMsIGluY2x1ZGluZyBlbXB0eSBzdHJpbmdzLCBidXQgYWxsb3dzIGJpZ2ludHNcbiAgICBjb25zdCB2YWxpZCA9IG1zID4gMCAmJiBtcyA8IEluZmluaXR5IFxuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbXMgIT09ICdudW1iZXInICYmIHR5cGVvZiBtcyAhPT0gJ2JpZ2ludCcpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzbGVlcDogbXMgbXVzdCBiZSBhIG51bWJlcicpXG4gICAgICB9XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCdzbGVlcDogbXMgbXVzdCBiZSBhIG51bWJlciB0aGF0IGlzIGdyZWF0ZXIgdGhhbiAwIGJ1dCBsZXNzIHRoYW4gSW5maW5pdHknKVxuICAgIH1cblxuICAgIEF0b21pY3Mud2FpdChuaWwsIDAsIDAsIE51bWJlcihtcykpXG4gIH1cbiAgbW9kdWxlLmV4cG9ydHMgPSBzbGVlcFxufSBlbHNlIHtcblxuICBmdW5jdGlvbiBzbGVlcCAobXMpIHtcbiAgICAvLyBhbHNvIGZpbHRlcnMgb3V0IE5hTiwgbm9uLW51bWJlciB0eXBlcywgaW5jbHVkaW5nIGVtcHR5IHN0cmluZ3MsIGJ1dCBhbGxvd3MgYmlnaW50c1xuICAgIGNvbnN0IHZhbGlkID0gbXMgPiAwICYmIG1zIDwgSW5maW5pdHkgXG4gICAgaWYgKHZhbGlkID09PSBmYWxzZSkge1xuICAgICAgaWYgKHR5cGVvZiBtcyAhPT0gJ251bWJlcicgJiYgdHlwZW9mIG1zICE9PSAnYmlnaW50Jykge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3NsZWVwOiBtcyBtdXN0IGJlIGEgbnVtYmVyJylcbiAgICAgIH1cbiAgICAgIHRocm93IFJhbmdlRXJyb3IoJ3NsZWVwOiBtcyBtdXN0IGJlIGEgbnVtYmVyIHRoYXQgaXMgZ3JlYXRlciB0aGFuIDAgYnV0IGxlc3MgdGhhbiBJbmZpbml0eScpXG4gICAgfVxuICAgIGNvbnN0IHRhcmdldCA9IERhdGUubm93KCkgKyBOdW1iZXIobXMpXG4gICAgd2hpbGUgKHRhcmdldCA+IERhdGUubm93KCkpe31cbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gc2xlZXBcblxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/atomic-sleep/index.js\n");

/***/ })

};
;