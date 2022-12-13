'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flattenProp = function flattenProp(propName) {
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);
    var FlattenProp = function FlattenProp(props) {
      return factory((0, _extends3.default)({}, props, props[propName]));
    };

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'flattenProp'))(FlattenProp);
    }
    return FlattenProp;
  };
};

exports.default = flattenProp;