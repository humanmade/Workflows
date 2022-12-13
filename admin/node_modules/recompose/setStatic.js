"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var setStatic = function setStatic(key, value) {
  return function (BaseComponent) {
    /* eslint-disable no-param-reassign */
    BaseComponent[key] = value;
    /* eslint-enable no-param-reassign */
    return BaseComponent;
  };
};

exports.default = setStatic;