import { OnchainKitComponent } from '@/components/AppProvider';
import { COMPONENT_CONFIG } from '@/components/DemoOptions';

export function getShareableUrl(activeComponent?: OnchainKitComponent) {
  if (!activeComponent) {
    return window.location.origin;
  }

  const relevantParams = getComponentQueryParams(activeComponent);

  const queryParams = getComponentQueryParams(activeComponent);
}

export function getComponentQueryParams(component: OnchainKitComponent) {
  const options = COMPONENT_CONFIG[component];
  if (!options) {
    return [];
  }

  return options.map((option) => option.name);
}
