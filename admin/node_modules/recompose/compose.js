"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var compose = function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  }, function (arg) {
    return arg;
  });
};

exports.default = compose;