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

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withContext = function withContext(childContextTypes, getChildContext) {
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);

    var WithContext = function (_Component) {
      (0, _inherits3.default)(WithContext, _Component);

      function WithContext() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WithContext);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getChildContext = function () {
          return getChildContext(_this.props);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
      }

      WithContext.prototype.render = function render() {
        return factory(this.props);
      };

      return WithContext;
    }(_react.Component);

    WithContext.childContextTypes = childContextTypes;

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'withContext'))(WithContext);
    }
    return WithContext;
  };
};

exports.default = withContext;