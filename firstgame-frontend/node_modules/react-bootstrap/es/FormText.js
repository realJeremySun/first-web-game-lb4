import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React from 'react';
import { useBootstrapPrefix } from './ThemeProvider';
var FormText = React.forwardRef( // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
function (_ref, ref) {
  var bsPrefix = _ref.bsPrefix,
      className = _ref.className,
      _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'small' : _ref$as,
      props = _objectWithoutPropertiesLoose(_ref, ["bsPrefix", "className", "as"]);

  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-text');
  return React.createElement(Component, _extends({}, props, {
    ref: ref,
    className: classNames(className, bsPrefix)
  }));
});
FormText.displayName = 'FormText';
export default FormText;