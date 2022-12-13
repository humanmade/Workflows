import React, { createFactory, Component, createElement } from 'react';
import _extends from 'babel-runtime/helpers/extends';
import shallowEqual from 'fbjs/lib/shallowEqual';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { polyfill } from 'react-lifecycles-compat';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { createChangeEmitter } from 'change-emitter';
import $$observable from 'symbol-observable';

var setStatic = function setStatic(key, value) {
  return function (BaseComponent) {
    /* eslint-disable no-param-reassign */
    BaseComponent[key] = value;
    /* eslint-enable no-param-reassign */
    return BaseComponent;
  };
};

var setDisplayName = function setDisplayName(displayName) {
  return setStatic('displayName', displayName);
};

var getDisplayName = function getDisplayName(Component$$1) {
  if (typeof Component$$1 === 'string') {
    return Component$$1;
  }

  if (!Component$$1) {
    return undefined;
  }

  return Component$$1.displayName || Component$$1.name || 'Component';
};

var wrapDisplayName = function wrapDisplayName(BaseComponent, hocName) {
  return hocName + '(' + getDisplayName(BaseComponent) + ')';
};

var mapProps = function mapProps(propsMapper) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var MapProps = function MapProps(props) {
      return factory(propsMapper(props));
    };
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps);
    }
    return MapProps;
  };
};

var withProps = function withProps(input) {
  var hoc = mapProps(function (props) {
    return _extends({}, props, typeof input === 'function' ? input(props) : input);
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var pick = function pick(obj, keys) {
  var result = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

var withPropsOnChange = function withPropsOnChange(shouldMapOrKeys, propsMapper) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var shouldMap = typeof shouldMapOrKeys === 'function' ? shouldMapOrKeys : function (props, nextProps) {
      return !shallowEqual(pick(props, shouldMapOrKeys), pick(nextProps, shouldMapOrKeys));
    };

    var WithPropsOnChange = function (_Component) {
      _inherits(WithPropsOnChange, _Component);

      function WithPropsOnChange() {
        var _temp, _this, _ret;

        _classCallCheck(this, WithPropsOnChange);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
          computedProps: propsMapper(_this.props),
          prevProps: _this.props
        }, _temp), _possibleConstructorReturn(_this, _ret);
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
        return factory(_extends({}, this.props, this.state.computedProps));
      };

      return WithPropsOnChange;
    }(Component);

    polyfill(WithPropsOnChange);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(WithPropsOnChange);
    }

    return WithPropsOnChange;
  };
};

var mapValues = function mapValues(obj, func) {
  var result = {};
  /* eslint-disable no-restricted-syntax */
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = func(obj[key], key);
    }
  }
  /* eslint-enable no-restricted-syntax */
  return result;
};

var withHandlers = function withHandlers(handlers) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithHandlers = function (_Component) {
      _inherits(WithHandlers, _Component);

      function WithHandlers() {
        var _temp, _this, _ret;

        _classCallCheck(this, WithHandlers);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
      }

      WithHandlers.prototype.render = function render() {
        return factory(_extends({}, this.props, this.handlers));
      };

      return WithHandlers;
    }(Component);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.handlers = mapValues(typeof handlers === 'function' ? handlers(this.props) : handlers, function (createHandler) {
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
      return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(WithHandlers);
    }
    return WithHandlers;
  };
};

var defaultProps = function defaultProps(props) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var DefaultProps = function DefaultProps(ownerProps) {
      return factory(ownerProps);
    };
    DefaultProps.defaultProps = props;
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(DefaultProps);
    }
    return DefaultProps;
  };
};

var omit = function omit(obj, keys) {
  var rest = _objectWithoutProperties(obj, []);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (rest.hasOwnProperty(key)) {
      delete rest[key];
    }
  }
  return rest;
};

var renameProp = function renameProp(oldName, newName) {
  var hoc = mapProps(function (props) {
    var _extends2;

    return _extends({}, omit(props, [oldName]), (_extends2 = {}, _extends2[newName] = props[oldName], _extends2));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'renameProp'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var keys = _Object$keys;


var mapKeys = function mapKeys(obj, func) {
  return keys(obj).reduce(function (result, key) {
    var val = obj[key];
    /* eslint-disable no-param-reassign */
    result[func(val, key)] = val;
    /* eslint-enable no-param-reassign */
    return result;
  }, {});
};

var renameProps = function renameProps(nameMap) {
  var hoc = mapProps(function (props) {
    return _extends({}, omit(props, keys(nameMap)), mapKeys(pick(props, keys(nameMap)), function (_, oldName) {
      return nameMap[oldName];
    }));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'renameProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var flattenProp = function flattenProp(propName) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var FlattenProp = function FlattenProp(props) {
      return factory(_extends({}, props, props[propName]));
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(FlattenProp);
    }
    return FlattenProp;
  };
};

var withState = function withState(stateName, stateUpdaterName, initialState) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithState = function (_Component) {
      _inherits(WithState, _Component);

      function WithState() {
        var _temp, _this, _ret;

        _classCallCheck(this, WithState);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
          stateValue: typeof initialState === 'function' ? initialState(_this.props) : initialState
        }, _this.updateStateValue = function (updateFn, callback) {
          return _this.setState(function (_ref) {
            var stateValue = _ref.stateValue;
            return {
              stateValue: typeof updateFn === 'function' ? updateFn(stateValue) : updateFn
            };
          }, callback);
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      WithState.prototype.render = function render() {
        var _extends2;

        return factory(_extends({}, this.props, (_extends2 = {}, _extends2[stateName] = this.state.stateValue, _extends2[stateUpdaterName] = this.updateStateValue, _extends2)));
      };

      return WithState;
    }(Component);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withState'))(WithState);
    }
    return WithState;
  };
};

var withStateHandlers = function withStateHandlers(initialState, stateUpdaters) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithStateHandlers = function (_Component) {
      _inherits(WithStateHandlers, _Component);

      function WithStateHandlers() {
        var _temp, _this, _ret;

        _classCallCheck(this, WithStateHandlers);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
      }

      WithStateHandlers.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var propsChanged = nextProps !== this.props;
        // the idea is to skip render if stateUpdater handler return undefined
        // this allows to create no state update handlers with access to state and props
        var stateChanged = !shallowEqual(nextState, this.state);
        return propsChanged || stateChanged;
      };

      WithStateHandlers.prototype.render = function render() {
        return factory(_extends({}, this.props, this.state, this.stateUpdaters));
      };

      return WithStateHandlers;
    }(Component);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.state = typeof initialState === 'function' ? initialState(this.props) : initialState;
      this.stateUpdaters = mapValues(stateUpdaters, function (handler) {
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
      return setDisplayName(wrapDisplayName(BaseComponent, 'withStateHandlers'))(WithStateHandlers);
    }
    return WithStateHandlers;
  };
};

var noop = function noop() {};

var withReducer = function withReducer(stateName, dispatchName, reducer, initialState) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithReducer = function (_Component) {
      _inherits(WithReducer, _Component);

      function WithReducer() {
        var _temp, _this, _ret;

        _classCallCheck(this, WithReducer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
          stateValue: _this.initializeStateValue()
        }, _this.dispatch = function (action) {
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
          return _this.setState(function (_ref) {
            var stateValue = _ref.stateValue;
            return {
              stateValue: reducer(stateValue, action)
            };
          }, function () {
            return callback(_this.state.stateValue);
          });
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      WithReducer.prototype.initializeStateValue = function initializeStateValue() {
        if (initialState !== undefined) {
          return typeof initialState === 'function' ? initialState(this.props) : initialState;
        }
        return reducer(undefined, { type: '@@recompose/INIT' });
      };

      WithReducer.prototype.render = function render() {
        var _extends2;

        return factory(_extends({}, this.props, (_extends2 = {}, _extends2[stateName] = this.state.stateValue, _extends2[dispatchName] = this.dispatch, _extends2)));
      };

      return WithReducer;
    }(Component);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withReducer'))(WithReducer);
    }
    return WithReducer;
  };
};

var identity = function identity(Component$$1) {
  return Component$$1;
};

var branch = function branch(test, left) {
  var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : identity;
  return function (BaseComponent) {
    var leftFactory = void 0;
    var rightFactory = void 0;
    var Branch = function Branch(props) {
      if (test(props)) {
        leftFactory = leftFactory || createFactory(left(BaseComponent));
        return leftFactory(props);
      }
      rightFactory = rightFactory || createFactory(right(BaseComponent));
      return rightFactory(props);
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'branch'))(Branch);
    }
    return Branch;
  };
};

var renderComponent = function renderComponent(Component$$1) {
  return function (_) {
    var factory = createFactory(Component$$1);
    var RenderComponent = function RenderComponent(props) {
      return factory(props);
    };
    if (process.env.NODE_ENV !== 'production') {
      RenderComponent.displayName = wrapDisplayName(Component$$1, 'renderComponent');
    }
    return RenderComponent;
  };
};

var Nothing = function (_Component) {
  _inherits(Nothing, _Component);

  function Nothing() {
    _classCallCheck(this, Nothing);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Nothing.prototype.render = function render() {
    return null;
  };

  return Nothing;
}(Component);

var renderNothing = function renderNothing(_) {
  return Nothing;
};

var shouldUpdate = function shouldUpdate(test) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var ShouldUpdate = function (_Component) {
      _inherits(ShouldUpdate, _Component);

      function ShouldUpdate() {
        _classCallCheck(this, ShouldUpdate);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
      }

      ShouldUpdate.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return test(this.props, nextProps);
      };

      ShouldUpdate.prototype.render = function render() {
        return factory(this.props);
      };

      return ShouldUpdate;
    }(Component);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'shouldUpdate'))(ShouldUpdate);
    }
    return ShouldUpdate;
  };
};

var pure = function pure(BaseComponent) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !shallowEqual(props, nextProps);
  });

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'pure'))(hoc(BaseComponent));
  }

  return hoc(BaseComponent);
};

var onlyUpdateForKeys = function onlyUpdateForKeys(propKeys) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !shallowEqual(pick(nextProps, propKeys), pick(props, propKeys));
  });

  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeys'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var onlyUpdateForPropTypes = function onlyUpdateForPropTypes(BaseComponent) {
  var propTypes = BaseComponent.propTypes;

  if (process.env.NODE_ENV !== 'production') {
    if (!propTypes) {
      /* eslint-disable */
      console.error('A component without any `propTypes` was passed to ' + '`onlyUpdateForPropTypes()`. Check the implementation of the ' + ('component with display name "' + getDisplayName(BaseComponent) + '".'));
      /* eslint-enable */
    }
  }

  var propKeys = _Object$keys(propTypes || {});
  var OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys)(BaseComponent);

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForPropTypes'))(OnlyUpdateForPropTypes);
  }
  return OnlyUpdateForPropTypes;
};

var withContext = function withContext(childContextTypes, getChildContext) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithContext = function (_Component) {
      _inherits(WithContext, _Component);

      function WithContext() {
        var _temp, _this, _ret;

        _classCallCheck(this, WithContext);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getChildContext = function () {
          return getChildContext(_this.props);
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      WithContext.prototype.render = function render() {
        return factory(this.props);
      };

      return WithContext;
    }(Component);

    WithContext.childContextTypes = childContextTypes;

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(WithContext);
    }
    return WithContext;
  };
};

var getContext = function getContext(contextTypes) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var GetContext = function GetContext(ownerProps, context) {
      return factory(_extends({}, ownerProps, context));
    };

    GetContext.contextTypes = contextTypes;

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(GetContext);
    }
    return GetContext;
  };
};

var lifecycle = function lifecycle(spec) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
      console.error('lifecycle() does not support the render method; its behavior is to ' + 'pass all props and state to the base component.');
    }

    var Lifecycle = function (_Component) {
      _inherits(Lifecycle, _Component);

      function Lifecycle() {
        _classCallCheck(this, Lifecycle);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
      }

      Lifecycle.prototype.render = function render() {
        return factory(_extends({}, this.props, this.state));
      };

      return Lifecycle;
    }(Component);

    _Object$keys(spec).forEach(function (hook) {
      return Lifecycle.prototype[hook] = spec[hook];
    });

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(Lifecycle);
    }
    return Lifecycle;
  };
};

var isClassComponent = function isClassComponent(Component$$1) {
  return Boolean(Component$$1 && Component$$1.prototype && typeof Component$$1.prototype.render === 'function');
};

var toClass = function toClass(baseComponent) {
  var _class, _temp;

  return isClassComponent(baseComponent) ? baseComponent : (_temp = _class = function (_Component) {
    _inherits(ToClass, _Component);

    function ToClass() {
      _classCallCheck(this, ToClass);

      return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ToClass.prototype.render = function render() {
      if (typeof baseComponent === 'string') {
        return React.createElement(baseComponent, this.props);
      }
      return baseComponent(this.props, this.context);
    };

    return ToClass;
  }(Component), _class.displayName = getDisplayName(baseComponent), _class.propTypes = baseComponent.propTypes, _class.contextTypes = baseComponent.contextTypes, _class.defaultProps = baseComponent.defaultProps, _temp);
};

function withRenderProps(hoc) {
  var RenderPropsComponent = function RenderPropsComponent(props) {
    return props.children(props);
  };
  return hoc(RenderPropsComponent);
}

var setPropTypes = function setPropTypes(propTypes) {
  return setStatic('propTypes', propTypes);
};

var compose = function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  }, function (arg) {
    return arg;
  });
};

var createSink = function createSink(callback) {
  var Sink = function (_Component) {
    _inherits(Sink, _Component);

    function Sink() {
      var _temp, _this, _ret;

      _classCallCheck(this, Sink);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Sink.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
      callback(nextProps);
      return null;
    };

    Sink.prototype.render = function render() {
      return null;
    };

    return Sink;
  }(Component);

  polyfill(Sink);
  return Sink;
};

var componentFromProp = function componentFromProp(propName) {
  var Component$$1 = function Component$$1(props) {
    return createElement(props[propName], omit(props, [propName]));
  };
  Component$$1.displayName = 'componentFromProp(' + propName + ')';
  return Component$$1;
};

var nest = function nest() {
  for (var _len = arguments.length, Components = Array(_len), _key = 0; _key < _len; _key++) {
    Components[_key] = arguments[_key];
  }

  var factories = Components.map(createFactory);
  var Nest = function Nest(_ref) {
    var children = _ref.children,
        props = _objectWithoutProperties(_ref, ['children']);

    return factories.reduceRight(function (child, factory) {
      return factory(props, child);
    }, children);
  };

  if (process.env.NODE_ENV !== 'production') {
    var displayNames = Components.map(getDisplayName);
    Nest.displayName = 'nest(' + displayNames.join(', ') + ')';
  }

  return Nest;
};

var hoistStatics = function hoistStatics(higherOrderComponent, blacklist) {
  return function (BaseComponent) {
    var NewComponent = higherOrderComponent(BaseComponent);
    hoistNonReactStatics(NewComponent, BaseComponent, blacklist);
    return NewComponent;
  };
};

var _config = {
  fromESObservable: null,
  toESObservable: null
};

var configureObservable = function configureObservable(c) {
  _config = c;
};

var config = {
  fromESObservable: function fromESObservable(observable) {
    return typeof _config.fromESObservable === 'function' ? _config.fromESObservable(observable) : observable;
  },
  toESObservable: function toESObservable(stream) {
    return typeof _config.toESObservable === 'function' ? _config.toESObservable(stream) : stream;
  }
};

var componentFromStreamWithConfig = function componentFromStreamWithConfig(config$$1) {
  return function (propsToVdom) {
    return function (_Component) {
      _inherits(ComponentFromStream, _Component);

      function ComponentFromStream() {
        var _config$fromESObserva;

        var _temp, _this, _ret;

        _classCallCheck(this, ComponentFromStream);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { vdom: null }, _this.propsEmitter = createChangeEmitter(), _this.props$ = config$$1.fromESObservable((_config$fromESObserva = {
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
        }, _config$fromESObserva[$$observable] = function () {
          return this;
        }, _config$fromESObserva)), _this.vdom$ = config$$1.toESObservable(propsToVdom(_this.props$)), _temp), _possibleConstructorReturn(_this, _ret);
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
    }(Component);
  };
};

var componentFromStream = function componentFromStream(propsToVdom) {
  return componentFromStreamWithConfig(config)(propsToVdom);
};

var identity$1 = function identity(t) {
  return t;
};

var mapPropsStreamWithConfig = function mapPropsStreamWithConfig(config$$1) {
  var componentFromStream$$1 = componentFromStreamWithConfig({
    fromESObservable: identity$1,
    toESObservable: identity$1
  });
  return function (transform) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      var fromESObservable = config$$1.fromESObservable,
          toESObservable = config$$1.toESObservable;

      return componentFromStream$$1(function (props$) {
        var _ref;

        return _ref = {
          subscribe: function subscribe(observer) {
            var subscription = toESObservable(transform(fromESObservable(props$))).subscribe({
              next: function next(childProps) {
                return observer.next(factory(childProps));
              }
            });
            return {
              unsubscribe: function unsubscribe() {
                return subscription.unsubscribe();
              }
            };
          }
        }, _ref[$$observable] = function () {
          return this;
        }, _ref;
      });
    };
  };
};

var mapPropsStream = function mapPropsStream(transform) {
  var hoc = mapPropsStreamWithConfig(config)(transform);

  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var createEventHandlerWithConfig = function createEventHandlerWithConfig(config$$1) {
  return function () {
    var _config$fromESObserva;

    var emitter = createChangeEmitter();
    var stream = config$$1.fromESObservable((_config$fromESObserva = {
      subscribe: function subscribe(observer) {
        var unsubscribe = emitter.listen(function (value) {
          return observer.next(value);
        });
        return { unsubscribe: unsubscribe };
      }
    }, _config$fromESObserva[$$observable] = function () {
      return this;
    }, _config$fromESObserva));
    return {
      handler: emitter.emit,
      stream: stream
    };
  };
};

var createEventHandler = createEventHandlerWithConfig(config);

// Higher-order component helpers

export { mapProps, withProps, withPropsOnChange, withHandlers, defaultProps, renameProp, renameProps, flattenProp, withState, withStateHandlers, withReducer, branch, renderComponent, renderNothing, shouldUpdate, pure, onlyUpdateForKeys, onlyUpdateForPropTypes, withContext, getContext, lifecycle, toClass, withRenderProps, setStatic, setPropTypes, setDisplayName, compose, getDisplayName, wrapDisplayName, shallowEqual, isClassComponent, createSink, componentFromProp, nest, hoistStatics, componentFromStream, componentFromStreamWithConfig, mapPropsStream, mapPropsStreamWithConfig, createEventHandler, createEventHandlerWithConfig, configureObservable as setObservableConfig };
