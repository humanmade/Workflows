'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _omit = require('./utils/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('./utils/pick');

var _pick2 = _interopRequireDefault(_pick);

var _mapProps = require('./mapProps');

var _mapProps2 = _interopRequireDefault(_mapProps);

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keys = _keys2.default;


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
  var hoc = (0, _mapProps2.default)(function (props) {
    return (0, _extends3.default)({}, (0, _omit2.default)(props, keys(nameMap)), mapKeys((0, _pick2.default)(props, keys(nameMap)), function (_, oldName) {
      return nameMap[oldName];
    }));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'renameProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

exports.default = renameProps;