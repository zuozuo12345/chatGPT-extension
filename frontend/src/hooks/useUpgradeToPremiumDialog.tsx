import React, { createContext, useContext, useMemo, useState } from "react";

interface UpgradeToPremiumDialogContextProviderType {
  show?: boolean;
  featureName?: string;
  children?: React.ReactNode;
  openUpgradeToPremiumDialog?: (
    args: openUpgradeToPremiumDialogType
  ) => void | null;
  closeUpgradeToPremiumDialog?: () => void | null;
  callbackFunctions?: callbackFunctionsType;
}

interface callbackFunctionsType {
  proceed: () => void | null;
  cancel: () => void | null;
}

interface openUpgradeToPremiumDialogType {
  callbackFunc?: callbackFunctionsType;
  featureName?: string;
}

const defaultValue: UpgradeToPremiumDialogContextProviderType = {
  show: false,
  featureName: null,
  openUpgradeToPremiumDialog: () => {},
  closeUpgradeToPremiumDialog: () => {},
  callbackFunctions: null,
};

export const UpgradeToPremiumDialogContext = createContext(defaultValue);

export const useUpgradeToPremiumDialog = () => {
  return useContext(UpgradeToPremiumDialogContext);
};

export const UpgradeToPremiumDialogContextProvider = ({
  children,
}: UpgradeToPremiumDialogContextProviderType) => {
  const [open, setOpen] = useState<boolean>(false);
  const [featureName, setFeatureName] = useState<string>(null);
  const [callbackFunctions, setCallbackFunctions] =
    useState<callbackFunctionsType>({
      proceed: null,
      cancel: null,
    });

  const handleClickOpen = (args: openUpgradeToPremiumDialogType) => {
    const { callbackFunc = null } = args;

    setOpen(true);

    if (callbackFunc !== null) {
      setCallbackFunctions({
        proceed: callbackFunc.proceed,
        cancel: callbackFunc.cancel,
      });
    }

    if (args.featureName) {
      setFeatureName(args.featureName);
    }
  };

  const handleClose = () => {
    setOpen(false);

    setCallbackFunctions({
      proceed: null,
      cancel: null,
    });

    setFeatureName(null);
  };

  // Context values
  const context = useMemo(() => {
    return {
      show: open,
      openUpgradeToPremiumDialog: ({
        callbackFunc = null,
        featureName = null,
      }: openUpgradeToPremiumDialogType) =>
        handleClickOpen({
          callbackFunc,
          featureName,
        }),
      closeUpgradeToPremiumDialog: handleClose,
      callbackFunctions,
      featureName,
    };
  }, [open, handleClickOpen, handleClose, callbackFunctions, featureName]);

  return (
    <UpgradeToPremiumDialogContext.Provider value={context}>
      {children}
    </UpgradeToPremiumDialogContext.Provider>
  );
};
