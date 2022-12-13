'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isClassComponent = function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && typeof Component.prototype.render === 'function');
};

exports.default = isClassComponent;