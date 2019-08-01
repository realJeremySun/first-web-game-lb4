import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React from 'react';
import useControllable from 'uncontrollable/hook';
import useEventCallback from '@restart/hooks/useEventCallback';
import createWithBsPrefix from './utils/createWithBsPrefix';
import divWithClassName from './utils/divWithClassName';
import { useBootstrapPrefix } from './ThemeProvider';
import Fade from './Fade';
import CloseButton from './CloseButton';
import SafeAnchor from './SafeAnchor';
var defaultProps = {
  show: true,
  transition: Fade,
  closeLabel: 'Close alert'
};
var controllables = {
  show: 'onClose'
};
var Alert = React.forwardRef(function (uncontrolledProps, ref) {
  var _useControllable = useControllable(uncontrolledProps, controllables),
      bsPrefix = _useControllable.bsPrefix,
      show = _useControllable.show,
      closeLabel = _useControllable.closeLabel,
      className = _useControllable.className,
      children = _useControllable.children,
      variant = _useControllable.variant,
      onClose = _useControllable.onClose,
      dismissible = _useControllable.dismissible,
      Transition = _useControllable.transition,
      props = _objectWithoutPropertiesLoose(_useControllable, ["bsPrefix", "show", "closeLabel", "className", "children", "variant", "onClose", "dismissible", "transition"]);

  var prefix = useBootstrapPrefix(bsPrefix, 'alert');
  var handleClose = useEventCallback(function (e) {
    onClose(false, e);
  });
  var alert = React.createElement("div", _extends({
    role: "alert"
  }, Transition ? props : undefined, {
    className: classNames(className, prefix, variant && prefix + "-" + variant, dismissible && prefix + "-dismissible")
  }), dismissible && React.createElement(CloseButton, {
    onClick: handleClose,
    label: closeLabel
  }), children);
  if (!Transition) return show ? alert : null;
  return React.createElement(Transition, _extends({
    unmountOnExit: true,
    ref: ref
  }, props, {
    in: show
  }), alert);
});
var DivStyledAsH4 = divWithClassName('h4');
DivStyledAsH4.displayName = 'DivStyledAsH4';
Alert.displayName = 'Alert';
Alert.defaultProps = defaultProps;
Alert.Link = createWithBsPrefix('alert-link', {
  Component: SafeAnchor
});
Alert.Heading = createWithBsPrefix('alert-heading', {
  Component: DivStyledAsH4
});
export default Alert;