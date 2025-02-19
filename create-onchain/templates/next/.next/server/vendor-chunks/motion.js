"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion";
exports.ids = ["vendor-chunks/motion"];
exports.modules = {

/***/ "(ssr)/./node_modules/motion/dist/animate.es.js":
/*!************************************************!*\
  !*** ./node_modules/motion/dist/animate.es.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animate: () => (/* binding */ animate),\n/* harmony export */   animateProgress: () => (/* binding */ animateProgress)\n/* harmony export */ });\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/animate/utils/controls.es.js\");\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/animate/index.es.js\");\n/* harmony import */ var _motionone_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @motionone/utils */ \"(ssr)/./node_modules/@motionone/utils/dist/is-function.es.js\");\n/* harmony import */ var _motionone_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @motionone/animation */ \"(ssr)/./node_modules/@motionone/animation/dist/Animation.es.js\");\n\n\n\n\nfunction animateProgress(target, options = {}) {\n    return (0,_motionone_dom__WEBPACK_IMPORTED_MODULE_0__.withControls)([\n        () => {\n            const animation = new _motionone_animation__WEBPACK_IMPORTED_MODULE_1__.Animation(target, [0, 1], options);\n            animation.finished.catch(() => { });\n            return animation;\n        },\n    ], options, options.duration);\n}\nfunction animate(target, keyframesOrOptions, options) {\n    const factory = (0,_motionone_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(target) ? animateProgress : _motionone_dom__WEBPACK_IMPORTED_MODULE_3__.animate;\n    return factory(target, keyframesOrOptions, options);\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvYW5pbWF0ZS5lcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBb0U7QUFDdEI7QUFDRzs7QUFFakQsNkNBQTZDO0FBQzdDLFdBQVcsNERBQVk7QUFDdkI7QUFDQSxrQ0FBa0MsMkRBQVM7QUFDM0MsOENBQThDO0FBQzlDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0REFBVSw2QkFBNkIsbURBQVM7QUFDcEU7QUFDQTs7QUFFb0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0Ly4vbm9kZV9tb2R1bGVzL21vdGlvbi9kaXN0L2FuaW1hdGUuZXMuanM/NGM1YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlIGFzIGFuaW1hdGUkMSwgd2l0aENvbnRyb2xzIH0gZnJvbSAnQG1vdGlvbm9uZS9kb20nO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJ0Btb3Rpb25vbmUvdXRpbHMnO1xuaW1wb3J0IHsgQW5pbWF0aW9uIH0gZnJvbSAnQG1vdGlvbm9uZS9hbmltYXRpb24nO1xuXG5mdW5jdGlvbiBhbmltYXRlUHJvZ3Jlc3ModGFyZ2V0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gd2l0aENvbnRyb2xzKFtcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbih0YXJnZXQsIFswLCAxXSwgb3B0aW9ucyk7XG4gICAgICAgICAgICBhbmltYXRpb24uZmluaXNoZWQuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb247XG4gICAgICAgIH0sXG4gICAgXSwgb3B0aW9ucywgb3B0aW9ucy5kdXJhdGlvbik7XG59XG5mdW5jdGlvbiBhbmltYXRlKHRhcmdldCwga2V5ZnJhbWVzT3JPcHRpb25zLCBvcHRpb25zKSB7XG4gICAgY29uc3QgZmFjdG9yeSA9IGlzRnVuY3Rpb24odGFyZ2V0KSA/IGFuaW1hdGVQcm9ncmVzcyA6IGFuaW1hdGUkMTtcbiAgICByZXR1cm4gZmFjdG9yeSh0YXJnZXQsIGtleWZyYW1lc09yT3B0aW9ucywgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IGFuaW1hdGUsIGFuaW1hdGVQcm9ncmVzcyB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion/dist/animate.es.js\n");

/***/ })

};
;