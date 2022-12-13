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

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _pick = require('./utils/pick');

var _pick2 = _interopRequireDefault(_pick);

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withPropsOnChange = function withPropsOnChange(shouldMapOrKeys, propsMapper) {
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);
    var shouldMap = typeof shouldMapOrKeys === 'function' ? shouldMapOrKeys : function (props, nextProps) {
      return !(0, _shallowEqual2.default)((0, _pick2.default)(props, shouldMapOrKeys), (0, _pick2.default)(nextProps, shouldMapOrKeys));
    };

    var WithPropsOnChange = function (_Component) {
      (0, _inherits3.default)(WithPropsOnChange, _Component);

      function WithPropsOnChange() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WithPropsOnChange);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
          computedProps: propsMapper(_this.props),
          prevProps: _this.props
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
      }

      WithPropsOnChange.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        if (shouldMap(prevState.prevProps, nextProps)) {
          return {
            computedProps: propsMapper(nextProps),
            prevProps: nextProps
          };
        }

        return null;
      };

      WithPropsOnChange.prototype.render = function render() {
        return factory((0, _extends3.default)({}, this.props, this.state.computedProps));
      };

      return WithPropsOnChange;
    }(_react.Component);

    (0, _reactLifecyclesCompat.polyfill)(WithPropsOnChange);

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'withPropsOnChange'))(WithPropsOnChange);
    }

    return WithPropsOnChange;
  };
};

exports.default = withPropsOnChange;