'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _getDisplayName = require('./getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nest = function nest() {
  for (var _len = arguments.length, Components = Array(_len), _key = 0; _key < _len; _key++) {
    Components[_key] = arguments[_key];
  }

  var factories = Components.map(_react.createFactory);
  var Nest = function Nest(_ref) {
    var children = _ref.children,
        props = (0, _objectWithoutProperties3.default)(_ref, ['children']);
    return factories.reduceRight(function (child, factory) {
      return factory(props, child);
    }, children);
  };

  if (process.env.NODE_ENV !== 'production') {
    var displayNames = Components.map(_getDisplayName2.default);
    Nest.displayName = 'nest(' + displayNames.join(', ') + ')';
  }

  return Nest;
};

exports.default = nest;