'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Nothing = function (_Component) {
  (0, _inherits3.default)(Nothing, _Component);

  function Nothing() {
    (0, _classCallCheck3.default)(this, Nothing);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  Nothing.prototype.render = function render() {
    return null;
  };

  return Nothing;
}(_react.Component);

var renderNothing = function renderNothing(_) {
  return Nothing;
};

exports.default = renderNothing;