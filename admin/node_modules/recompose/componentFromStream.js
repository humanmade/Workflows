'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.componentFromStreamWithConfig = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _changeEmitter = require('change-emitter');

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

var _setObservableConfig = require('./setObservableConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentFromStreamWithConfig = exports.componentFromStreamWithConfig = function componentFromStreamWithConfig(config) {
  return function (propsToVdom) {
    return function (_Component) {
      (0, _inherits3.default)(ComponentFromStream, _Component);

      function ComponentFromStream() {
        var _config$fromESObserva;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, ComponentFromStream);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { vdom: null }, _this.propsEmitter = (0, _changeEmitter.createChangeEmitter)(), _this.props$ = config.fromESObservable((_config$fromESObserva = {
          subscribe: function subscribe(observer) {
            var unsubscribe = _this.propsEmitter.listen(function (props) {
              if (props) {
                observer.next(props);
              } else {
                observer.complete();
              }
            });
            return { unsubscribe: unsubscribe };
          }
        }, _config$fromESObserva[_symbolObservable2.default] = function () {
          return this;
        }, _config$fromESObserva)), _this.vdom$ = config.toESObservable(propsToVdom(_this.props$)), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
      }

      // Stream of props


      // Stream of vdom


      ComponentFromStream.prototype.componentWillMount = function componentWillMount() {
        var _this2 = this;

        // Subscribe to child prop changes so we know when to re-render
        this.subscription = this.vdom$.subscribe({
          next: function next(vdom) {
            _this2.setState({ vdom: vdom });
          }
        });
        this.propsEmitter.emit(this.props);
      };

      ComponentFromStream.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // Receive new props from the owner
        this.propsEmitter.emit(nextProps);
      };

      ComponentFromStream.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return nextState.vdom !== this.state.vdom;
      };

      ComponentFromStream.prototype.componentWillUnmount = function componentWillUnmount() {
        // Call without arguments to complete stream
        this.propsEmitter.emit();

        // Clean-up subscription before un-mounting
        this.subscription.unsubscribe();
      };

      ComponentFromStream.prototype.render = function render() {
        return this.state.vdom;
      };

      return ComponentFromStream;
    }(_react.Component);
  };
};

var componentFromStream = function componentFromStream(propsToVdom) {
  return componentFromStreamWithConfig(_setObservableConfig.config)(propsToVdom);
};

exports.default = componentFromStream;