(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.Recompose = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

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

  var getDisplayName = function getDisplayName(Component) {
    if (typeof Component === 'string') {
      return Component;
    }

    if (!Component) {
      return undefined;
    }

    return Component.displayName || Component.name || 'Component';
  };

  var wrapDisplayName = function wrapDisplayName(BaseComponent, hocName) {
    return hocName + '(' + getDisplayName(BaseComponent) + ')';
  };

  var mapProps = function mapProps(propsMapper) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);
      var MapProps = function MapProps(props) {
        return factory(propsMapper(props));
      };
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps);
      }
      return MapProps;
    };
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.5.5' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject = function (it) {
    if (!_isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var document = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject(document) && _isObject(document.createElement);
  var _domCreate = function (it) {
    return is ? document.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var IS_WRAP = type & $export.W;
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE];
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
    var key, own, out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      if (own && _has(exports, key)) continue;
      // export native or passed
      out = own ? target[key] : source[key];
      // prevent global pollution for namespaces
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
      // bind timers to global for call from export context
      : IS_BIND && own ? _ctx(out, _global)
      // wrap global constructors for prevent change them in library
      : IS_WRAP && target[key] == out ? (function (C) {
        var F = function (a, b, c) {
          if (this instanceof C) {
            switch (arguments.length) {
              case 0: return new C();
              case 1: return new C(a);
              case 2: return new C(a, b);
            } return new C(a, b, c);
          } return C.apply(this, arguments);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      // make static versions for prototype methods
      })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
      if (IS_PROTO) {
        (exports.virtual || (exports.virtual = {}))[key] = out;
        // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
        if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
      }
    }
  };
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof(it) == 'String' ? it.split('') : Object(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max(index + length, 0) : min$1(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});
  var _shared = function (key) {
    return store[key] || (store[key] = {});
  };

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var shared = _shared('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);
  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var f$1 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$1
  };

  var f$2 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$2
  };

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(_defined(it));
  };

  // 19.1.2.1 Object.assign(target, source, ...)





  var $assign = Object.assign;

  // should work with symbols and should have deterministic property order (V8 bug)
  var _objectAssign = !$assign || _fails(function () {
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) { B[k] = k; });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = _toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = _objectGops.f;
    var isEnum = _objectPie.f;
    while (aLen > index) {
      var S = _iobject(arguments[index++]);
      var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    } return T;
  } : $assign;

  // 19.1.3.1 Object.assign(target, source)


  _export(_export.S + _export.F, 'Object', { assign: _objectAssign });

  var assign = _core.Object.assign;

  var assign$1 = createCommonjsModule(function (module) {
  module.exports = { "default": assign, __esModule: true };
  });

  unwrapExports(assign$1);

  var _extends = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _assign2 = _interopRequireDefault(assign$1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  });

  var _extends$1 = unwrapExports(_extends);

  var withProps = function withProps(input) {
    var hoc = mapProps(function (props) {
      return _extends$1({}, props, typeof input === 'function' ? input(props) : input);
    });
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(hoc(BaseComponent));
      };
    }
    return hoc;
  };

  var classCallCheck = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;

  exports.default = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  });

  var _classCallCheck = unwrapExports(classCallCheck);

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var _library = true;

  var _redefine = _hide;

  var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject(O);
    var keys = _objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  var document$1 = _global.document;
  var _html = document$1 && document$1.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = _sharedKey('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate('iframe');
    var i = _enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  var def = _objectDp.f;

  var TAG = _wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
  };

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
    _setToStringTag(Constructor, NAME + ' Iterator');
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = _sharedKey('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var ITERATOR = _wks('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    }
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) _redefine(proto, key, methods[key]);
      } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  var $at = _stringAt(true);

  // 21.1.3.27 String.prototype[@@iterator]()
  _iterDefine(String, 'String', function (iterated) {
    this._t = String(iterated); // target
    this._i = 0;                // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var index = this._i;
    var point;
    if (index >= O.length) return { value: undefined, done: true };
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  });

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  }, 'values');

  var TO_STRING_TAG = _wks('toStringTag');

  var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
    'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
    'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
    'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
    'TextTrackList,TouchList').split(',');

  for (var i = 0; i < DOMIterables.length; i++) {
    var NAME = DOMIterables[i];
    var Collection = _global[NAME];
    var proto = Collection && Collection.prototype;
    if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  }

  var f$3 = _wks;

  var _wksExt = {
  	f: f$3
  };

  var iterator = _wksExt.f('iterator');

  var iterator$1 = createCommonjsModule(function (module) {
  module.exports = { "default": iterator, __esModule: true };
  });

  unwrapExports(iterator$1);

  var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');


  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {}          // weak collections IDs
    } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
    // return object ID
    } return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
    // return hash weak collections IDs
    } return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var defineProperty = _objectDp.f;
  var _wksDefine = function (name) {
    var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
    if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
  };

  // all enumerable object keys, includes symbols



  var _enumKeys = function (it) {
    var result = _objectKeys(it);
    var getSymbols = _objectGops.f;
    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = _objectPie.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  // 7.2.2 IsArray(argument)

  var _isArray = Array.isArray || function isArray(arg) {
    return _cof(arg) == 'Array';
  };

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

  var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return _objectKeysInternal(O, hiddenKeys);
  };

  var _objectGopn = {
  	f: f$4
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var gOPN = _objectGopn.f;
  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN(it);
    } catch (e) {
      return windowNames.slice();
    }
  };

  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
  };

  var _objectGopnExt = {
  	f: f$5
  };

  var gOPD = Object.getOwnPropertyDescriptor;

  var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = _toIobject(O);
    P = _toPrimitive(P, true);
    if (_ie8DomDefine) try {
      return gOPD(O, P);
    } catch (e) { /* empty */ }
    if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
  };

  var _objectGopd = {
  	f: f$6
  };

  // ECMAScript 6 symbols shim





  var META = _meta.KEY;



















  var gOPD$1 = _objectGopd.f;
  var dP$1 = _objectDp.f;
  var gOPN$1 = _objectGopnExt.f;
  var $Symbol = _global.Symbol;
  var $JSON = _global.JSON;
  var _stringify = $JSON && $JSON.stringify;
  var PROTOTYPE$2 = 'prototype';
  var HIDDEN = _wks('_hidden');
  var TO_PRIMITIVE = _wks('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = _shared('symbol-registry');
  var AllSymbols = _shared('symbols');
  var OPSymbols = _shared('op-symbols');
  var ObjectProto$1 = Object[PROTOTYPE$2];
  var USE_NATIVE = typeof $Symbol == 'function';
  var QObject = _global.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDesc = _descriptors && _fails(function () {
    return _objectCreate(dP$1({}, 'a', {
      get: function () { return dP$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD$1(ObjectProto$1, key);
    if (protoDesc) delete ObjectProto$1[key];
    dP$1(it, key, D);
    if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
  } : dP$1;

  var wrap = function (tag) {
    var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
    _anObject(it);
    key = _toPrimitive(key, true);
    _anObject(D);
    if (_has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
      } return setSymbolDesc(it, key, D);
    } return dP$1(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    _anObject(it);
    var keys = _enumKeys(P = _toIobject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create(it, P) {
    return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = _toPrimitive(key, true));
    if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
    return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = _toIobject(it);
    key = _toPrimitive(key, true);
    if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
    var D = gOPD$1(it, key);
    if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN$1(_toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    } return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto$1;
    var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // 19.4.1.1 Symbol([description])
  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
      var $set = function (value) {
        if (this === ObjectProto$1) $set.call(OPSymbols, value);
        if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, _propertyDesc(1, value));
      };
      if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
      return wrap(tag);
    };
    _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
      return this._k;
    });

    _objectGopd.f = $getOwnPropertyDescriptor;
    _objectDp.f = $defineProperty;
    _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
    _objectPie.f = $propertyIsEnumerable;
    _objectGops.f = $getOwnPropertySymbols;

    if (_descriptors && !_library) {
      _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    _wksExt.f = function (name) {
      return wrap(_wks(name));
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

  for (var es6Symbols = (
    // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

  for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

  _export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return _has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { setter = true; },
    useSimple: function () { setter = false; }
  });

  _export(_export.S + _export.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // 24.3.2 JSON.stringify(value [, replacer [, space]])
  $JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
    var S = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols
    return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!_isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  });

  // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
  $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
  // 19.4.3.5 Symbol.prototype[@@toStringTag]
  _setToStringTag($Symbol, 'Symbol');
  // 20.2.1.9 Math[@@toStringTag]
  _setToStringTag(Math, 'Math', true);
  // 24.3.3 JSON[@@toStringTag]
  _setToStringTag(_global.JSON, 'JSON', true);

  _wksDefine('asyncIterator');

  _wksDefine('observable');

  var symbol = _core.Symbol;

  var symbol$1 = createCommonjsModule(function (module) {
  module.exports = { "default": symbol, __esModule: true };
  });

  unwrapExports(symbol$1);

  var _typeof_1 = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _iterator2 = _interopRequireDefault(iterator$1);



  var _symbol2 = _interopRequireDefault(symbol$1);

  var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
  };
  });

  unwrapExports(_typeof_1);

  var possibleConstructorReturn = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _typeof3 = _interopRequireDefault(_typeof_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  };
  });

  var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */


  var check = function (O, proto) {
    _anObject(O);
    if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };
  var _setProto = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
      function (test, buggy, set) {
        try {
          set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
          set(test, []);
          buggy = !(test instanceof Array);
        } catch (e) { buggy = true; }
        return function setPrototypeOf(O, proto) {
          check(O, proto);
          if (buggy) O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }({}, false) : undefined),
    check: check
  };

  // 19.1.3.19 Object.setPrototypeOf(O, proto)

  _export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

  var setPrototypeOf = _core.Object.setPrototypeOf;

  var setPrototypeOf$1 = createCommonjsModule(function (module) {
  module.exports = { "default": setPrototypeOf, __esModule: true };
  });

  unwrapExports(setPrototypeOf$1);

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  _export(_export.S, 'Object', { create: _objectCreate });

  var $Object = _core.Object;
  var create = function create(P, D) {
    return $Object.create(P, D);
  };

  var create$1 = createCommonjsModule(function (module) {
  module.exports = { "default": create, __esModule: true };
  });

  unwrapExports(create$1);

  var inherits = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf$1);



  var _create2 = _interopRequireDefault(create$1);



  var _typeof3 = _interopRequireDefault(_typeof_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }

    subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  };
  });

  var _inherits = unwrapExports(inherits);

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  function componentWillMount() {
    // Call this.constructor.gDSFP to support sub-classes.
    var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
    if (state !== null && state !== undefined) {
      this.setState(state);
    }
  }

  function componentWillReceiveProps(nextProps) {
    // Call this.constructor.gDSFP to support sub-classes.
    var state = this.constructor.getDerivedStateFromProps(nextProps, this.state);
    if (state !== null && state !== undefined) {
      this.setState(state);
    }
  }

  function componentWillUpdate(nextProps, nextState) {
    try {
      var prevProps = this.props;
      var prevState = this.state;
      this.props = nextProps;
      this.state = nextState;
      this.__reactInternalSnapshotFlag = true;
      this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
        prevProps,
        prevState
      );
    } finally {
      this.props = prevProps;
      this.state = prevState;
    }
  }

  // React may warn about cWM/cWRP/cWU methods being deprecated.
  // Add a flag to suppress these warnings for this special case.
  componentWillMount.__suppressDeprecationWarning = true;
  componentWillReceiveProps.__suppressDeprecationWarning = true;
  componentWillUpdate.__suppressDeprecationWarning = true;

  function polyfill(Component) {
    var prototype = Component.prototype;

    if (!prototype || !prototype.isReactComponent) {
      throw new Error('Can only polyfill class components');
    }

    if (
      typeof Component.getDerivedStateFromProps !== 'function' &&
      typeof prototype.getSnapshotBeforeUpdate !== 'function'
    ) {
      return Component;
    }

    // If new component APIs are defined, "unsafe" lifecycles won't be called.
    // Error if any of these lifecycles are present,
    // Because they would work differently between older and newer (16.3+) versions of React.
    var foundWillMountName = null;
    var foundWillReceivePropsName = null;
    var foundWillUpdateName = null;
    if (typeof prototype.componentWillMount === 'function') {
      foundWillMountName = 'componentWillMount';
    } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
      foundWillMountName = 'UNSAFE_componentWillMount';
    }
    if (typeof prototype.componentWillReceiveProps === 'function') {
      foundWillReceivePropsName = 'componentWillReceiveProps';
    } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
      foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
    }
    if (typeof prototype.componentWillUpdate === 'function') {
      foundWillUpdateName = 'componentWillUpdate';
    } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
      foundWillUpdateName = 'UNSAFE_componentWillUpdate';
    }
    if (
      foundWillMountName !== null ||
      foundWillReceivePropsName !== null ||
      foundWillUpdateName !== null
    ) {
      var componentName = Component.displayName || Component.name;
      var newApiName =
        typeof Component.getDerivedStateFromProps === 'function'
          ? 'getDerivedStateFromProps()'
          : 'getSnapshotBeforeUpdate()';

      throw Error(
        'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
          componentName +
          ' uses ' +
          newApiName +
          ' but also contains the following legacy lifecycles:' +
          (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
          (foundWillReceivePropsName !== null
            ? '\n  ' + foundWillReceivePropsName
            : '') +
          (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
          '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
          'https://fb.me/react-async-component-lifecycle-hooks'
      );
    }

    // React <= 16.2 does not support static getDerivedStateFromProps.
    // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
    // Newer versions of React will ignore these lifecycles if gDSFP exists.
    if (typeof Component.getDerivedStateFromProps === 'function') {
      prototype.componentWillMount = componentWillMount;
      prototype.componentWillReceiveProps = componentWillReceiveProps;
    }

    // React <= 16.2 does not support getSnapshotBeforeUpdate.
    // As a workaround, use cWU to invoke the new lifecycle.
    // Newer versions of React will ignore that lifecycle if gSBU exists.
    if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
      if (typeof prototype.componentDidUpdate !== 'function') {
        throw new Error(
          'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
        );
      }

      prototype.componentWillUpdate = componentWillUpdate;

      var componentDidUpdate = prototype.componentDidUpdate;

      prototype.componentDidUpdate = function componentDidUpdatePolyfill(
        prevProps,
        prevState,
        maybeSnapshot
      ) {
        // 16.3+ will not execute our will-update method;
        // It will pass a snapshot value to did-update though.
        // Older versions will require our polyfilled will-update value.
        // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
        // Because for <= 15.x versions this might be a "prevContext" object.
        // We also can't just check "__reactInternalSnapshot",
        // Because get-snapshot might return a falsy value.
        // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
        var snapshot = this.__reactInternalSnapshotFlag
          ? this.__reactInternalSnapshot
          : maybeSnapshot;

        componentDidUpdate.call(this, prevProps, prevState, snapshot);
      };
    }

    return Component;
  }

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

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @typechecks
   * 
   */

  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  function is$1(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      // Added the nonzero y check to make Flow happy, but it is redundant
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }

  /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */
  function shallowEqual(objA, objB) {
    if (is$1(objA, objB)) {
      return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
      if (!hasOwnProperty$1.call(objB, keysA[i]) || !is$1(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }

    return true;
  }

  var shallowEqual_1 = shallowEqual;

  var withPropsOnChange = function withPropsOnChange(shouldMapOrKeys, propsMapper) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);
      var shouldMap = typeof shouldMapOrKeys === 'function' ? shouldMapOrKeys : function (props, nextProps) {
        return !shallowEqual_1(pick(props, shouldMapOrKeys), pick(nextProps, shouldMapOrKeys));
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
          return factory(_extends$1({}, this.props, this.state.computedProps));
        };

        return WithPropsOnChange;
      }(React.Component);

      polyfill(WithPropsOnChange);

      {
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
      var factory = React.createFactory(BaseComponent);

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
          return factory(_extends$1({}, this.props, this.handlers));
        };

        return WithHandlers;
      }(React.Component);

      var _initialiseProps = function _initialiseProps() {
        var _this2 = this;

        this.handlers = mapValues(typeof handlers === 'function' ? handlers(this.props) : handlers, function (createHandler) {
          return function () {
            var handler = createHandler(_this2.props);

            if ("development" !== 'production' && typeof handler !== 'function') {
              console.error(
              // eslint-disable-line no-console
              'withHandlers(): Expected a map of higher-order functions. ' + 'Refer to the docs for more info.');
            }

            return handler.apply(undefined, arguments);
          };
        });
      };

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(WithHandlers);
      }
      return WithHandlers;
    };
  };

  var defaultProps = function defaultProps(props) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);
      var DefaultProps = function DefaultProps(ownerProps) {
        return factory(ownerProps);
      };
      DefaultProps.defaultProps = props;
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(DefaultProps);
      }
      return DefaultProps;
    };
  };

  var objectWithoutProperties = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;

  exports.default = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };
  });

  var _objectWithoutProperties = unwrapExports(objectWithoutProperties);

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

      return _extends$1({}, omit(props, [oldName]), (_extends2 = {}, _extends2[newName] = props[oldName], _extends2));
    });
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'renameProp'))(hoc(BaseComponent));
      };
    }
    return hoc;
  };

  // most Object methods by ES6 should accept primitives



  var _objectSap = function (KEY, exec) {
    var fn = (_core.Object || {})[KEY] || Object[KEY];
    var exp = {};
    exp[KEY] = exec(fn);
    _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
  };

  // 19.1.2.14 Object.keys(O)



  _objectSap('keys', function () {
    return function keys(it) {
      return _objectKeys(_toObject(it));
    };
  });

  var keys = _core.Object.keys;

  var keys$1 = createCommonjsModule(function (module) {
  module.exports = { "default": keys, __esModule: true };
  });

  var _Object$keys = unwrapExports(keys$1);

  var keys$2 = _Object$keys;


  var mapKeys = function mapKeys(obj, func) {
    return keys$2(obj).reduce(function (result, key) {
      var val = obj[key];
      /* eslint-disable no-param-reassign */
      result[func(val, key)] = val;
      /* eslint-enable no-param-reassign */
      return result;
    }, {});
  };

  var renameProps = function renameProps(nameMap) {
    var hoc = mapProps(function (props) {
      return _extends$1({}, omit(props, keys$2(nameMap)), mapKeys(pick(props, keys$2(nameMap)), function (_, oldName) {
        return nameMap[oldName];
      }));
    });
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'renameProps'))(hoc(BaseComponent));
      };
    }
    return hoc;
  };

  var flattenProp = function flattenProp(propName) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);
      var FlattenProp = function FlattenProp(props) {
        return factory(_extends$1({}, props, props[propName]));
      };

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(FlattenProp);
      }
      return FlattenProp;
    };
  };

  var withState = function withState(stateName, stateUpdaterName, initialState) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);

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

          return factory(_extends$1({}, this.props, (_extends2 = {}, _extends2[stateName] = this.state.stateValue, _extends2[stateUpdaterName] = this.updateStateValue, _extends2)));
        };

        return WithState;
      }(React.Component);

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withState'))(WithState);
      }
      return WithState;
    };
  };

  var withStateHandlers = function withStateHandlers(initialState, stateUpdaters) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);

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
          var stateChanged = !shallowEqual_1(nextState, this.state);
          return propsChanged || stateChanged;
        };

        WithStateHandlers.prototype.render = function render() {
          return factory(_extends$1({}, this.props, this.state, this.stateUpdaters));
        };

        return WithStateHandlers;
      }(React.Component);

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

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withStateHandlers'))(WithStateHandlers);
      }
      return WithStateHandlers;
    };
  };

  var noop = function noop() {};

  var withReducer = function withReducer(stateName, dispatchName, reducer, initialState) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);

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

          return factory(_extends$1({}, this.props, (_extends2 = {}, _extends2[stateName] = this.state.stateValue, _extends2[dispatchName] = this.dispatch, _extends2)));
        };

        return WithReducer;
      }(React.Component);

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withReducer'))(WithReducer);
      }
      return WithReducer;
    };
  };

  var identity = function identity(Component) {
    return Component;
  };

  var branch = function branch(test, left) {
    var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : identity;
    return function (BaseComponent) {
      var leftFactory = void 0;
      var rightFactory = void 0;
      var Branch = function Branch(props) {
        if (test(props)) {
          leftFactory = leftFactory || React.createFactory(left(BaseComponent));
          return leftFactory(props);
        }
        rightFactory = rightFactory || React.createFactory(right(BaseComponent));
        return rightFactory(props);
      };

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'branch'))(Branch);
      }
      return Branch;
    };
  };

  var renderComponent = function renderComponent(Component) {
    return function (_) {
      var factory = React.createFactory(Component);
      var RenderComponent = function RenderComponent(props) {
        return factory(props);
      };
      {
        RenderComponent.displayName = wrapDisplayName(Component, 'renderComponent');
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
  }(React.Component);

  var renderNothing = function renderNothing(_) {
    return Nothing;
  };

  var shouldUpdate = function shouldUpdate(test) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);

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
      }(React.Component);

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'shouldUpdate'))(ShouldUpdate);
      }
      return ShouldUpdate;
    };
  };

  var pure = function pure(BaseComponent) {
    var hoc = shouldUpdate(function (props, nextProps) {
      return !shallowEqual_1(props, nextProps);
    });

    {
      return setDisplayName(wrapDisplayName(BaseComponent, 'pure'))(hoc(BaseComponent));
    }

    return hoc(BaseComponent);
  };

  var onlyUpdateForKeys = function onlyUpdateForKeys(propKeys) {
    var hoc = shouldUpdate(function (props, nextProps) {
      return !shallowEqual_1(pick(nextProps, propKeys), pick(props, propKeys));
    });

    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeys'))(hoc(BaseComponent));
      };
    }
    return hoc;
  };

  var onlyUpdateForPropTypes = function onlyUpdateForPropTypes(BaseComponent) {
    var propTypes = BaseComponent.propTypes;

    {
      if (!propTypes) {
        /* eslint-disable */
        console.error('A component without any `propTypes` was passed to ' + '`onlyUpdateForPropTypes()`. Check the implementation of the ' + ('component with display name "' + getDisplayName(BaseComponent) + '".'));
        /* eslint-enable */
      }
    }

    var propKeys = _Object$keys(propTypes || {});
    var OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys)(BaseComponent);

    {
      return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForPropTypes'))(OnlyUpdateForPropTypes);
    }
    return OnlyUpdateForPropTypes;
  };

  var withContext = function withContext(childContextTypes, getChildContext) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);

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
      }(React.Component);

      WithContext.childContextTypes = childContextTypes;

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(WithContext);
      }
      return WithContext;
    };
  };

  var getContext = function getContext(contextTypes) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);
      var GetContext = function GetContext(ownerProps, context) {
        return factory(_extends$1({}, ownerProps, context));
      };

      GetContext.contextTypes = contextTypes;

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(GetContext);
      }
      return GetContext;
    };
  };

  var lifecycle = function lifecycle(spec) {
    return function (BaseComponent) {
      var factory = React.createFactory(BaseComponent);

      if ("development" !== 'production' && spec.hasOwnProperty('render')) {
        console.error('lifecycle() does not support the render method; its behavior is to ' + 'pass all props and state to the base component.');
      }

      var Lifecycle = function (_Component) {
        _inherits(Lifecycle, _Component);

        function Lifecycle() {
          _classCallCheck(this, Lifecycle);

          return _possibleConstructorReturn(this, _Component.apply(this, arguments));
        }

        Lifecycle.prototype.render = function render() {
          return factory(_extends$1({}, this.props, this.state));
        };

        return Lifecycle;
      }(React.Component);

      _Object$keys(spec).forEach(function (hook) {
        return Lifecycle.prototype[hook] = spec[hook];
      });

      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(Lifecycle);
      }
      return Lifecycle;
    };
  };

  var isClassComponent = function isClassComponent(Component) {
    return Boolean(Component && Component.prototype && typeof Component.prototype.render === 'function');
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
          return React__default.createElement(baseComponent, this.props);
        }
        return baseComponent(this.props, this.context);
      };

      return ToClass;
    }(React.Component), _class.displayName = getDisplayName(baseComponent), _class.propTypes = baseComponent.propTypes, _class.contextTypes = baseComponent.contextTypes, _class.defaultProps = baseComponent.defaultProps, _temp);
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
    }(React.Component);

    polyfill(Sink);
    return Sink;
  };

  var componentFromProp = function componentFromProp(propName) {
    var Component = function Component(props) {
      return React.createElement(props[propName], omit(props, [propName]));
    };
    Component.displayName = 'componentFromProp(' + propName + ')';
    return Component;
  };

  var nest = function nest() {
    for (var _len = arguments.length, Components = Array(_len), _key = 0; _key < _len; _key++) {
      Components[_key] = arguments[_key];
    }

    var factories = Components.map(React.createFactory);
    var Nest = function Nest(_ref) {
      var children = _ref.children,
          props = _objectWithoutProperties(_ref, ['children']);

      return factories.reduceRight(function (child, factory) {
        return factory(props, child);
      }, children);
    };

    {
      var displayNames = Components.map(getDisplayName);
      Nest.displayName = 'nest(' + displayNames.join(', ') + ')';
    }

    return Nest;
  };

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */

  var REACT_STATICS = {
      childContextTypes: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      mixins: true,
      propTypes: true,
      type: true
  };

  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
  };

  var defineProperty$1 = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

  var hoistNonReactStatics = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

          if (objectPrototype) {
              var inheritedComponent = getPrototypeOf(sourceComponent);
              if (inheritedComponent && inheritedComponent !== objectPrototype) {
                  hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
              }
          }

          var keys = getOwnPropertyNames(sourceComponent);

          if (getOwnPropertySymbols) {
              keys = keys.concat(getOwnPropertySymbols(sourceComponent));
          }

          for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                  var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                  try { // Avoid failures from read-only properties
                      defineProperty$1(targetComponent, key, descriptor);
                  } catch (e) {}
              }
          }

          return targetComponent;
      }

      return targetComponent;
  };

  var hoistStatics = function hoistStatics(higherOrderComponent, blacklist) {
    return function (BaseComponent) {
      var NewComponent = higherOrderComponent(BaseComponent);
      hoistNonReactStatics(NewComponent, BaseComponent, blacklist);
      return NewComponent;
    };
  };

  var lib = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var createChangeEmitter = exports.createChangeEmitter = function createChangeEmitter() {
    var currentListeners = [];
    var nextListeners = currentListeners;

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }

    function listen(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.');
      }

      var isSubscribed = true;

      ensureCanMutateNextListeners();
      nextListeners.push(listener);

      return function () {
        if (!isSubscribed) {
          return;
        }

        isSubscribed = false;

        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }

    function emit() {
      currentListeners = nextListeners;
      var listeners = currentListeners;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(listeners, arguments);
      }
    }

    return {
      listen: listen,
      emit: emit
    };
  };
  });

  unwrapExports(lib);
  var lib_1 = lib.createChangeEmitter;

  var ponyfill = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
  	value: true
  });
  exports['default'] = symbolObservablePonyfill;
  function symbolObservablePonyfill(root) {
  	var result;
  	var _Symbol = root.Symbol;

  	if (typeof _Symbol === 'function') {
  		if (_Symbol.observable) {
  			result = _Symbol.observable;
  		} else {
  			result = _Symbol('observable');
  			_Symbol.observable = result;
  		}
  	} else {
  		result = '@@observable';
  	}

  	return result;
  }});

  unwrapExports(ponyfill);

  var lib$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });



  var _ponyfill2 = _interopRequireDefault(ponyfill);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var root; /* global window */


  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof commonjsGlobal !== 'undefined') {
    root = commonjsGlobal;
  } else {
    root = module;
  }

  var result = (0, _ponyfill2['default'])(root);
  exports['default'] = result;
  });

  unwrapExports(lib$1);

  var symbolObservable = lib$1;

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

          return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { vdom: null }, _this.propsEmitter = lib_1(), _this.props$ = config$$1.fromESObservable((_config$fromESObserva = {
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
          }, _config$fromESObserva[symbolObservable] = function () {
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
      }(React.Component);
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
        var factory = React.createFactory(BaseComponent);
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
          }, _ref[symbolObservable] = function () {
            return this;
          }, _ref;
        });
      };
    };
  };

  var mapPropsStream = function mapPropsStream(transform) {
    var hoc = mapPropsStreamWithConfig(config)(transform);

    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(hoc(BaseComponent));
      };
    }
    return hoc;
  };

  var createEventHandlerWithConfig = function createEventHandlerWithConfig(config$$1) {
    return function () {
      var _config$fromESObserva;

      var emitter = lib_1();
      var stream = config$$1.fromESObservable((_config$fromESObserva = {
        subscribe: function subscribe(observer) {
          var unsubscribe = emitter.listen(function (value) {
            return observer.next(value);
          });
          return { unsubscribe: unsubscribe };
        }
      }, _config$fromESObserva[symbolObservable] = function () {
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

  exports.mapProps = mapProps;
  exports.withProps = withProps;
  exports.withPropsOnChange = withPropsOnChange;
  exports.withHandlers = withHandlers;
  exports.defaultProps = defaultProps;
  exports.renameProp = renameProp;
  exports.renameProps = renameProps;
  exports.flattenProp = flattenProp;
  exports.withState = withState;
  exports.withStateHandlers = withStateHandlers;
  exports.withReducer = withReducer;
  exports.branch = branch;
  exports.renderComponent = renderComponent;
  exports.renderNothing = renderNothing;
  exports.shouldUpdate = shouldUpdate;
  exports.pure = pure;
  exports.onlyUpdateForKeys = onlyUpdateForKeys;
  exports.onlyUpdateForPropTypes = onlyUpdateForPropTypes;
  exports.withContext = withContext;
  exports.getContext = getContext;
  exports.lifecycle = lifecycle;
  exports.toClass = toClass;
  exports.withRenderProps = withRenderProps;
  exports.setStatic = setStatic;
  exports.setPropTypes = setPropTypes;
  exports.setDisplayName = setDisplayName;
  exports.compose = compose;
  exports.getDisplayName = getDisplayName;
  exports.wrapDisplayName = wrapDisplayName;
  exports.shallowEqual = shallowEqual_1;
  exports.isClassComponent = isClassComponent;
  exports.createSink = createSink;
  exports.componentFromProp = componentFromProp;
  exports.nest = nest;
  exports.hoistStatics = hoistStatics;
  exports.componentFromStream = componentFromStream;
  exports.componentFromStreamWithConfig = componentFromStreamWithConfig;
  exports.mapPropsStream = mapPropsStream;
  exports.mapPropsStreamWithConfig = mapPropsStreamWithConfig;
  exports.createEventHandler = createEventHandler;
  exports.createEventHandlerWithConfig = createEventHandlerWithConfig;
  exports.setObservableConfig = configureObservable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
