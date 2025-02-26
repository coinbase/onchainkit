"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/minimalistic-crypto-utils";
exports.ids = ["vendor-chunks/minimalistic-crypto-utils"];
exports.modules = {

/***/ "(ssr)/./node_modules/minimalistic-crypto-utils/lib/utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/minimalistic-crypto-utils/lib/utils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nvar utils = exports;\n\nfunction toArray(msg, enc) {\n  if (Array.isArray(msg))\n    return msg.slice();\n  if (!msg)\n    return [];\n  var res = [];\n  if (typeof msg !== 'string') {\n    for (var i = 0; i < msg.length; i++)\n      res[i] = msg[i] | 0;\n    return res;\n  }\n  if (enc === 'hex') {\n    msg = msg.replace(/[^a-z0-9]+/ig, '');\n    if (msg.length % 2 !== 0)\n      msg = '0' + msg;\n    for (var i = 0; i < msg.length; i += 2)\n      res.push(parseInt(msg[i] + msg[i + 1], 16));\n  } else {\n    for (var i = 0; i < msg.length; i++) {\n      var c = msg.charCodeAt(i);\n      var hi = c >> 8;\n      var lo = c & 0xff;\n      if (hi)\n        res.push(hi, lo);\n      else\n        res.push(lo);\n    }\n  }\n  return res;\n}\nutils.toArray = toArray;\n\nfunction zero2(word) {\n  if (word.length === 1)\n    return '0' + word;\n  else\n    return word;\n}\nutils.zero2 = zero2;\n\nfunction toHex(msg) {\n  var res = '';\n  for (var i = 0; i < msg.length; i++)\n    res += zero2(msg[i].toString(16));\n  return res;\n}\nutils.toHex = toHex;\n\nutils.encode = function encode(arr, enc) {\n  if (enc === 'hex')\n    return toHex(arr);\n  else\n    return arr;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWluaW1hbGlzdGljLWNyeXB0by11dGlscy9saWIvdXRpbHMuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBLElBQUk7QUFDSixvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0Ly4vbm9kZV9tb2R1bGVzL21pbmltYWxpc3RpYy1jcnlwdG8tdXRpbHMvbGliL3V0aWxzLmpzP2M1YmYiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSBleHBvcnRzO1xuXG5mdW5jdGlvbiB0b0FycmF5KG1zZywgZW5jKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG1zZykpXG4gICAgcmV0dXJuIG1zZy5zbGljZSgpO1xuICBpZiAoIW1zZylcbiAgICByZXR1cm4gW107XG4gIHZhciByZXMgPSBbXTtcbiAgaWYgKHR5cGVvZiBtc2cgIT09ICdzdHJpbmcnKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyspXG4gICAgICByZXNbaV0gPSBtc2dbaV0gfCAwO1xuICAgIHJldHVybiByZXM7XG4gIH1cbiAgaWYgKGVuYyA9PT0gJ2hleCcpIHtcbiAgICBtc2cgPSBtc2cucmVwbGFjZSgvW15hLXowLTldKy9pZywgJycpO1xuICAgIGlmIChtc2cubGVuZ3RoICUgMiAhPT0gMClcbiAgICAgIG1zZyA9ICcwJyArIG1zZztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkgKz0gMilcbiAgICAgIHJlcy5wdXNoKHBhcnNlSW50KG1zZ1tpXSArIG1zZ1tpICsgMV0sIDE2KSk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gbXNnLmNoYXJDb2RlQXQoaSk7XG4gICAgICB2YXIgaGkgPSBjID4+IDg7XG4gICAgICB2YXIgbG8gPSBjICYgMHhmZjtcbiAgICAgIGlmIChoaSlcbiAgICAgICAgcmVzLnB1c2goaGksIGxvKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzLnB1c2gobG8pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufVxudXRpbHMudG9BcnJheSA9IHRvQXJyYXk7XG5cbmZ1bmN0aW9uIHplcm8yKHdvcmQpIHtcbiAgaWYgKHdvcmQubGVuZ3RoID09PSAxKVxuICAgIHJldHVybiAnMCcgKyB3b3JkO1xuICBlbHNlXG4gICAgcmV0dXJuIHdvcmQ7XG59XG51dGlscy56ZXJvMiA9IHplcm8yO1xuXG5mdW5jdGlvbiB0b0hleChtc2cpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKylcbiAgICByZXMgKz0gemVybzIobXNnW2ldLnRvU3RyaW5nKDE2KSk7XG4gIHJldHVybiByZXM7XG59XG51dGlscy50b0hleCA9IHRvSGV4O1xuXG51dGlscy5lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoYXJyLCBlbmMpIHtcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXG4gICAgcmV0dXJuIHRvSGV4KGFycik7XG4gIGVsc2VcbiAgICByZXR1cm4gYXJyO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/minimalistic-crypto-utils/lib/utils.js\n");

/***/ })

};
;