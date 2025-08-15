import { createContext, useContext } from 'react';

type LayerConfigContextType = {
  skipPopoverPortal?: boolean;
  forceDropdownModal?: boolean;
};

export const LayerConfigContext = createContext<LayerConfigContextType>({
  skipPopoverPortal: false,
  forceDropdownModal: false,
});

export const LayerConfigProvider = ({
  children,
  skipPopoverPortal = false,
  forceDropdownModal = false,
}: {
  children: React.ReactNode;
} & LayerConfigContextType) => {
  return (
    <LayerConfigContext.Provider
      value={{
        skipPopoverPortal,
        forceDropdownModal,
      }}
    >
      {children}
    </LayerConfigContext.Provider>
  );
};

export const useLayerConfigContext = () => {
  return useContext(LayerConfigContext);
};
