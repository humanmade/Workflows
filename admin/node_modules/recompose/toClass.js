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

var _react2 = _interopRequireDefault(_react);

var _getDisplayName = require('./getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _isClassComponent = require('./isClassComponent');

var _isClassComponent2 = _interopRequireDefault(_isClassComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toClass = function toClass(baseComponent) {
  var _class, _temp;

  return (0, _isClassComponent2.default)(baseComponent) ? baseComponent : (_temp = _class = function (_Component) {
    (0, _inherits3.default)(ToClass, _Component);

    function ToClass() {
      (0, _classCallCheck3.default)(this, ToClass);
      return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ToClass.prototype.render = function render() {
      if (typeof baseComponent === 'string') {
        return _react2.default.createElement(baseComponent, this.props);
      }
      return baseComponent(this.props, this.context);
    };

    return ToClass;
  }(_react.Component), _class.displayName = (0, _getDisplayName2.default)(baseComponent), _class.propTypes = baseComponent.propTypes, _class.contextTypes = baseComponent.contextTypes, _class.defaultProps = baseComponent.defaultProps, _temp);
};
exports.default = toClass;