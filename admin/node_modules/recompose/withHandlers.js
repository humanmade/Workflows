'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _mapValues = require('./utils/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var withHandlers = function withHandlers(handlers) {
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);

    var WithHandlers = function (_Component) {
      (0, _inherits3.default)(WithHandlers, _Component);

      function WithHandlers() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WithHandlers);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
      }

      WithHandlers.prototype.render = function render() {
        return factory((0, _extends3.default)({}, this.props, this.handlers));
      };

      return WithHandlers;
    }(_react.Component);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.handlers = (0, _mapValues2.default)(typeof handlers === 'function' ? handlers(this.props) : handlers, function (createHandler) {
        return function () {
          var handler = createHandler(_this2.props);

          if (process.env.NODE_ENV !== 'production' && typeof handler !== 'function') {
            console.error(
            // eslint-disable-line no-console
            'withHandlers(): Expected a map of higher-order functions. ' + 'Refer to the docs for more info.');
          }

          return handler.apply(undefined, arguments);
        };
      });
    };

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'withHandlers'))(WithHandlers);
    }
    return WithHandlers;
  };
};

exports.default = withHandlers;