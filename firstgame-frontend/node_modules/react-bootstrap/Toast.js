"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Fade = _interopRequireDefault(require("./Fade"));

var _ToastHeader = _interopRequireDefault(require("./ToastHeader"));

var _ToastBody = _interopRequireDefault(require("./ToastBody"));

var _ThemeProvider = require("./ThemeProvider");

var _ToastContext = _interopRequireDefault(require("./ToastContext"));

var defaultProps = {
  animation: true,
  autohide: false,
  delay: 3000,
  show: true,
  transition: _Fade.default
};

var Toast = function Toast(_ref) {
  var bsPrefix = _ref.bsPrefix,
      className = _ref.className,
      children = _ref.children,
      Transition = _ref.transition,
      show = _ref.show,
      animation = _ref.animation,
      delay = _ref.delay,
      autohide = _ref.autohide,
      onClose = _ref.onClose,
      innerRef = _ref.innerRef,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["bsPrefix", "className", "children", "transition", "show", "animation", "delay", "autohide", "onClose", "innerRef"]);
  (0, _react.useEffect)(function () {
    if (autohide && show) {
      var timer = setTimeout(function () {
        onClose();
      }, delay);
      return function () {
        clearTimeout(timer);
      };
    }

    return function () {
      return null;
    };
  }, [autohide, show]);
  var useAnimation = Transition && animation;

  var toast = _react.default.createElement("div", (0, _extends2.default)({}, props, {
    ref: innerRef,
    className: (0, _classnames.default)(bsPrefix, className, !useAnimation && show && 'show'),
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }), children);

  var toastContext = {
    onClose: onClose
  };
  return _react.default.createElement(_ToastContext.default.Provider, {
    value: toastContext
  }, useAnimation ? _react.default.createElement(Transition, {
    in: show
  }, toast) : toast);
};

Toast.defaultProps = defaultProps;
var DecoratedToast = (0, _ThemeProvider.createBootstrapComponent)(Toast, 'toast');
DecoratedToast.Body = _ToastBody.default;
DecoratedToast.Header = _ToastHeader.default;
var _default = DecoratedToast;
exports.default = _default;
module.exports = exports["default"];