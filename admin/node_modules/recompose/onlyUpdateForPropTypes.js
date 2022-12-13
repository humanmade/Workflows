'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _onlyUpdateForKeys = require('./onlyUpdateForKeys');

var _onlyUpdateForKeys2 = _interopRequireDefault(_onlyUpdateForKeys);

var _setDisplayName = require('./setDisplayName');

var _setDisplayName2 = _interopRequireDefault(_setDisplayName);

var _wrapDisplayName = require('./wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

var _getDisplayName = require('./getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onlyUpdateForPropTypes = function onlyUpdateForPropTypes(BaseComponent) {
  var propTypes = BaseComponent.propTypes;

  if (process.env.NODE_ENV !== 'production') {
    if (!propTypes) {
      /* eslint-disable */
      console.error('A component without any `propTypes` was passed to ' + '`onlyUpdateForPropTypes()`. Check the implementation of the ' + ('component with display name "' + (0, _getDisplayName2.default)(BaseComponent) + '".'));
      /* eslint-enable */
    }
  }

  var propKeys = (0, _keys2.default)(propTypes || {});
  var OnlyUpdateForPropTypes = (0, _onlyUpdateForKeys2.default)(propKeys)(BaseComponent);

  if (process.env.NODE_ENV !== 'production') {
    return (0, _setDisplayName2.default)((0, _wrapDisplayName2.default)(BaseComponent, 'onlyUpdateForPropTypes'))(OnlyUpdateForPropTypes);
  }
  return OnlyUpdateForPropTypes;
};

exports.default = onlyUpdateForPropTypes;