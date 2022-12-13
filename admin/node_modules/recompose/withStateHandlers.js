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

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _mapValues = require('./utils/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withStateHandlers = function withStateHandlers(initialState, stateUpdaters) {
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);

    var WithStateHandlers = function (_Component) {
      (0, _inherits3.default)(WithStateHandlers, _Component);

      function WithStateHandlers() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WithStateHandlers);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
      }

      WithStateHandlers.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var propsChanged = nextProps !== this.props;
        // the idea is to skip render if stateUpdater handler return undefined
        // this allows to create no state update handlers with access to state and props
        var stateChanged = !(0, _shallowEqual2.default)(nextState, this.state);
        return propsChanged || stateChanged;
      };

      WithStateHandlers.prototype.render = function render() {
        return factory((0, _extends3.default)({}, this.props, this.state, this.stateUpdaters));
      };

      return WithStateHandlers;
    }(_react.Component);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.state = typeof initialState === 'function' ? initialState(this.props) : initialState;
      this.stateUpdaters = (0, _mapValues2.default)(stateUpdaters, function (handler) {
        return function (mayBeEvent) {
          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          // Having that functional form of setState can be called async
          // we need to persist SyntheticEvent
          if (mayBeEvent && typeof mayBeEvent.persist === 'function') {
            mayBeEvent.persist();
          }

          _this2.setState(function (state, props) {
            return handler(state, props).apply(undefined, [mayBeEvent].concat(args));
          });
        };
      });
    };

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'withStateHandlers'))(WithStateHandlers);
    }
    return WithStateHandlers;
  };
};

exports.default = withStateHandlers;