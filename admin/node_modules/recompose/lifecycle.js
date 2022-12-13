'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lifecycle = function lifecycle(spec) {
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);

    if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
      console.error('lifecycle() does not support the render method; its behavior is to ' + 'pass all props and state to the base component.');
    }

    var Lifecycle = function (_Component) {
      (0, _inherits3.default)(Lifecycle, _Component);

      function Lifecycle() {
        (0, _classCallCheck3.default)(this, Lifecycle);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
      }

      Lifecycle.prototype.render = function render() {
        return factory((0, _extends3.default)({}, this.props, this.state));
      };

      return Lifecycle;
    }(_react.Component);

    (0, _keys2.default)(spec).forEach(function (hook) {
      return Lifecycle.prototype[hook] = spec[hook];
    });

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'lifecycle'))(Lifecycle);
    }
    return Lifecycle;
  };
}; /* eslint-disable no-console */
exports.default = lifecycle;