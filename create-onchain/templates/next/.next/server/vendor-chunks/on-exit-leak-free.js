"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/on-exit-leak-free";
exports.ids = ["vendor-chunks/on-exit-leak-free"];
exports.modules = {

/***/ "(ssr)/./node_modules/on-exit-leak-free/index.js":
/*!*************************************************!*\
  !*** ./node_modules/on-exit-leak-free/index.js ***!
  \*************************************************/
/***/ ((module) => {

eval("\n\nfunction genWrap (wraps, ref, fn, event) {\n  function wrap () {\n    const obj = ref.deref()\n    // This should alway happen, however GC is\n    // undeterministic so it might happen.\n    /* istanbul ignore else */\n    if (obj !== undefined) {\n      fn(obj, event)\n    }\n  }\n\n  wraps[event] = wrap\n  process.once(event, wrap)\n}\n\nconst registry = new FinalizationRegistry(clear)\nconst map = new WeakMap()\n\nfunction clear (wraps) {\n  process.removeListener('exit', wraps.exit)\n  process.removeListener('beforeExit', wraps.beforeExit)\n}\n\nfunction register (obj, fn) {\n  if (obj === undefined) {\n    throw new Error('the object can\\'t be undefined')\n  }\n  const ref = new WeakRef(obj)\n\n  const wraps = {}\n  map.set(obj, wraps)\n  registry.register(obj, wraps)\n\n  genWrap(wraps, ref, fn, 'exit')\n  genWrap(wraps, ref, fn, 'beforeExit')\n}\n\nfunction unregister (obj) {\n  const wraps = map.get(obj)\n  map.delete(obj)\n  if (wraps) {\n    clear(wraps)\n  }\n  registry.unregister(obj)\n}\n\nmodule.exports = {\n  register,\n  unregister\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvb24tZXhpdC1sZWFrLWZyZWUvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0Ly4vbm9kZV9tb2R1bGVzL29uLWV4aXQtbGVhay1mcmVlL2luZGV4LmpzPzFiMWMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIGdlbldyYXAgKHdyYXBzLCByZWYsIGZuLCBldmVudCkge1xuICBmdW5jdGlvbiB3cmFwICgpIHtcbiAgICBjb25zdCBvYmogPSByZWYuZGVyZWYoKVxuICAgIC8vIFRoaXMgc2hvdWxkIGFsd2F5IGhhcHBlbiwgaG93ZXZlciBHQyBpc1xuICAgIC8vIHVuZGV0ZXJtaW5pc3RpYyBzbyBpdCBtaWdodCBoYXBwZW4uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAob2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZuKG9iaiwgZXZlbnQpXG4gICAgfVxuICB9XG5cbiAgd3JhcHNbZXZlbnRdID0gd3JhcFxuICBwcm9jZXNzLm9uY2UoZXZlbnQsIHdyYXApXG59XG5cbmNvbnN0IHJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KGNsZWFyKVxuY29uc3QgbWFwID0gbmV3IFdlYWtNYXAoKVxuXG5mdW5jdGlvbiBjbGVhciAod3JhcHMpIHtcbiAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcignZXhpdCcsIHdyYXBzLmV4aXQpXG4gIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoJ2JlZm9yZUV4aXQnLCB3cmFwcy5iZWZvcmVFeGl0KVxufVxuXG5mdW5jdGlvbiByZWdpc3RlciAob2JqLCBmbikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBvYmplY3QgY2FuXFwndCBiZSB1bmRlZmluZWQnKVxuICB9XG4gIGNvbnN0IHJlZiA9IG5ldyBXZWFrUmVmKG9iailcblxuICBjb25zdCB3cmFwcyA9IHt9XG4gIG1hcC5zZXQob2JqLCB3cmFwcylcbiAgcmVnaXN0cnkucmVnaXN0ZXIob2JqLCB3cmFwcylcblxuICBnZW5XcmFwKHdyYXBzLCByZWYsIGZuLCAnZXhpdCcpXG4gIGdlbldyYXAod3JhcHMsIHJlZiwgZm4sICdiZWZvcmVFeGl0Jylcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3RlciAob2JqKSB7XG4gIGNvbnN0IHdyYXBzID0gbWFwLmdldChvYmopXG4gIG1hcC5kZWxldGUob2JqKVxuICBpZiAod3JhcHMpIHtcbiAgICBjbGVhcih3cmFwcylcbiAgfVxuICByZWdpc3RyeS51bnJlZ2lzdGVyKG9iailcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlZ2lzdGVyLFxuICB1bnJlZ2lzdGVyXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/on-exit-leak-free/index.js\n");

/***/ })

};
;