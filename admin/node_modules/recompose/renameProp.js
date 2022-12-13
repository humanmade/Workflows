'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _omit = require('./utils/omit');

var _omit2 = _interopRequireDefault(_omit);

var _mapProps = require('./mapProps');

var _mapProps2 = _interopRequireDefault(_mapProps);

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renameProp = function renameProp(oldName, newName) {
  var hoc = (0, _mapProps2.default)(function (props) {
    var _extends2;

    return (0, _extends4.default)({}, (0, _omit2.default)(props, [oldName]), (_extends2 = {}, _extends2[newName] = props[oldName], _extends2));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'renameProp'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

exports.default = renameProp;