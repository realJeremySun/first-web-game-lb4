import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import React, { useEffect } from 'react';
import classNames from 'classnames';
import Fade from './Fade';
import Header from './ToastHeader';
import Body from './ToastBody';
import { createBootstrapComponent } from './ThemeProvider';
import ToastContext from './ToastContext';
var defaultProps = {
  animation: true,
  autohide: false,
  delay: 3000,
  show: true,
  transition: Fade
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
      props = _objectWithoutPropertiesLoose(_ref, ["bsPrefix", "className", "children", "transition", "show", "animation", "delay", "autohide", "onClose", "innerRef"]);

  useEffect(function () {
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
  var toast = React.createElement("div", _extends({}, props, {
    ref: innerRef,
    className: classNames(bsPrefix, className, !useAnimation && show && 'show'),
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }), children);
  var toastContext = {
    onClose: onClose
  };
  return React.createElement(ToastContext.Provider, {
    value: toastContext
  }, useAnimation ? React.createElement(Transition, {
    in: show
  }, toast) : toast);
};

Toast.defaultProps = defaultProps;
var DecoratedToast = createBootstrapComponent(Toast, 'toast');
DecoratedToast.Body = Body;
DecoratedToast.Header = Header;
export default DecoratedToast;