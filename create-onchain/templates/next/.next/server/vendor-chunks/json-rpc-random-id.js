/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/json-rpc-random-id";
exports.ids = ["vendor-chunks/json-rpc-random-id"];
exports.modules = {

/***/ "(ssr)/./node_modules/json-rpc-random-id/index.js":
/*!**************************************************!*\
  !*** ./node_modules/json-rpc-random-id/index.js ***!
  \**************************************************/
/***/ ((module) => {

eval("module.exports = IdIterator\n\nfunction IdIterator(opts){\n  opts = opts || {}\n  var max = opts.max || Number.MAX_SAFE_INTEGER\n  var idCounter = typeof opts.start !== 'undefined' ? opts.start : Math.floor(Math.random() * max)\n\n  return function createRandomId () {\n    idCounter = idCounter % max\n    return idCounter++\n  }\n\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvanNvbi1ycGMtcmFuZG9tLWlkL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC8uL25vZGVfbW9kdWxlcy9qc29uLXJwYy1yYW5kb20taWQvaW5kZXguanM/MGM5YyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IElkSXRlcmF0b3JcblxuZnVuY3Rpb24gSWRJdGVyYXRvcihvcHRzKXtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdmFyIG1heCA9IG9wdHMubWF4IHx8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gIHZhciBpZENvdW50ZXIgPSB0eXBlb2Ygb3B0cy5zdGFydCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRzLnN0YXJ0IDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KVxuXG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVSYW5kb21JZCAoKSB7XG4gICAgaWRDb3VudGVyID0gaWRDb3VudGVyICUgbWF4XG4gICAgcmV0dXJuIGlkQ291bnRlcisrXG4gIH1cblxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/json-rpc-random-id/index.js\n");

/***/ })

};
;