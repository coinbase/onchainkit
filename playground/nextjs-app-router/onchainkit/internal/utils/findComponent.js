import { isValidElement } from 'react';
function findComponent(component) {
  return child => {
    return /*#__PURE__*/isValidElement(child) && child.type === component;
  };
}
export { findComponent };
//# sourceMappingURL=findComponent.js.map
