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

var _reactLifecyclesCompat = require('react-lifecycles-compat');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createSink = function createSink(callback) {
  var Sink = function (_Component) {
    (0, _inherits3.default)(Sink, _Component);

    function Sink() {
      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, Sink);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    Sink.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
      callback(nextProps);
      return null;
    };

    Sink.prototype.render = function render() {
      return null;
    };

    return Sink;
  }(_react.Component);

  (0, _reactLifecyclesCompat.polyfill)(Sink);
  return Sink;
};

exports.default = createSink;