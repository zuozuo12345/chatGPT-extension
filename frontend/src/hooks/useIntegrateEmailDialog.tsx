import React, { createContext, useContext, useMemo, useState } from "react";
import { USER_DETAILS_DATA_TYPE } from "../typescript/types/user";

interface IntegrateEmailDialogContextProviderType {
  show?: boolean;
  children?: React.ReactNode;
  openIntegrateEmailDialog?: (
    args: openIntegrateEmailDialogType
  ) => void | null;
  closeIntegrateEmailDialog?: () => void | null;
  callbackFunctions?: callbackFunctionsType;
  sessionDetails?: USER_DETAILS_DATA_TYPE;
}

interface callbackFunctionsType {
  proceed: () => void | null;
  cancel: () => void | null;
  serviceProvider?: {
    microsoft?: () => void | null;
  };
  dontShowAgain?: () => void | null;
  sessionDetails?: USER_DETAILS_DATA_TYPE;
}

interface openIntegrateEmailDialogType {
  callbackFunc?: callbackFunctionsType;
}

const defaultValue: IntegrateEmailDialogContextProviderType = {
  show: false,
  openIntegrateEmailDialog: () => {},
  closeIntegrateEmailDialog: () => {},
  callbackFunctions: null,
  sessionDetails: null,
};

export const IntegrateEmailDialogContext = createContext(defaultValue);

export const useIntegrateEmailDialog = () => {
  return useContext(IntegrateEmailDialogContext);
};

export const IntegrateEmailDialogContextProvider = ({
  children,
}: IntegrateEmailDialogContextProviderType) => {
  const [open, setOpen] = useState<boolean>(false);
  const [callbackFunctions, setCallbackFunctions] =
    useState<callbackFunctionsType>({
      proceed: null,
      cancel: null,
      serviceProvider: null,
      dontShowAgain: null,
    });
  const [sessionDetails, setSessionDetails] =
    useState<USER_DETAILS_DATA_TYPE>(null);

  const handleClickOpen = (args: openIntegrateEmailDialogType) => {
    const { callbackFunc = null } = args;

    setOpen(true);

    if (callbackFunc !== null) {
      setCallbackFunctions({
        proceed: callbackFunc.proceed,
        cancel: callbackFunc.cancel,
        serviceProvider:
          callbackFunc.serviceProvider && callbackFunc.serviceProvider.microsoft
            ? {
                microsoft: callbackFunc.serviceProvider.microsoft,
              }
            : null,
        dontShowAgain: callbackFunc.dontShowAgain
          ? callbackFunc.dontShowAgain
          : null,
      });
    }

    if (callbackFunc.sessionDetails) {
      setSessionDetails(callbackFunc.sessionDetails);
    }
  };

  const handleClose = () => {
    setOpen(false);

    setCallbackFunctions({
      proceed: null,
      cancel: null,
      serviceProvider: null,
    });

    setSessionDetails(null);
  };

  // Context values
  const context = useMemo(() => {
    return {
      show: open,
      openIntegrateEmailDialog: ({
        callbackFunc = null,
      }: openIntegrateEmailDialogType) =>
        handleClickOpen({
          callbackFunc,
        }),
      closeIntegrateEmailDialog: handleClose,
      callbackFunctions,
      sessionDetails,
    };
  }, [open, handleClickOpen, handleClose, callbackFunctions, sessionDetails]);

  return (
    <IntegrateEmailDialogContext.Provider value={context}>
      {children}
    </IntegrateEmailDialogContext.Provider>
  );
};
