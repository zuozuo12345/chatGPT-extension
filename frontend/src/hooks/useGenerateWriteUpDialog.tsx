import React, { createContext, useContext, useMemo, useState } from "react";

interface GenerateWriteUpDialogContextProviderType {
  show?: boolean;
  recommendedCandidateId?: string;
  children?: React.ReactNode;
  openGenerateWriteUpDialog?: (
    args: openGenerateWriteUpDialogType
  ) => void | null;
  closeGenerateWriteUpDialog?: () => void | null;
  callbackFunctions?: callbackFunctionsType;
}

interface callbackFunctionsType {
  proceed: () => void | null;
  cancel: () => void | null;
}

interface openGenerateWriteUpDialogType {
  callbackFunc?: callbackFunctionsType;
  recommendedCandidateId?: string;
}

const defaultValue: GenerateWriteUpDialogContextProviderType = {
  show: false,
  recommendedCandidateId: null,
  openGenerateWriteUpDialog: () => {},
  closeGenerateWriteUpDialog: () => {},
  callbackFunctions: null,
};

export const GenerateWriteUpDialogContext = createContext(defaultValue);

export const useGenerateWriteUpDialog = () => {
  return useContext(GenerateWriteUpDialogContext);
};

export const GenerateWriteUpDialogContextProvider = ({
  children,
}: GenerateWriteUpDialogContextProviderType) => {
  const [open, setOpen] = useState<boolean>(false);
  const [recommendedCandidateId, setRecommendedCandidateId] =
    useState<string>(null);
  const [callbackFunctions, setCallbackFunctions] =
    useState<callbackFunctionsType>({
      proceed: null,
      cancel: null,
    });

  const handleClickOpen = (args: openGenerateWriteUpDialogType) => {
    const { callbackFunc = null } = args;

    setOpen(true);

    if (callbackFunc !== null) {
      setCallbackFunctions({
        proceed: callbackFunc.proceed,
        cancel: callbackFunc.cancel,
      });
    }

    if (args.recommendedCandidateId) {
      setRecommendedCandidateId(args.recommendedCandidateId);
    }
  };

  const handleClose = () => {
    setOpen(false);

    setCallbackFunctions({
      proceed: null,
      cancel: null,
    });

    setRecommendedCandidateId(null);
  };

  // Context values
  const context = useMemo(() => {
    return {
      show: open,
      openGenerateWriteUpDialog: ({
        callbackFunc = null,
        recommendedCandidateId = null,
      }: openGenerateWriteUpDialogType) =>
        handleClickOpen({
          callbackFunc,
          recommendedCandidateId,
        }),
      closeGenerateWriteUpDialog: handleClose,
      callbackFunctions,
      recommendedCandidateId,
    };
  }, [
    open,
    handleClickOpen,
    handleClose,
    callbackFunctions,
    recommendedCandidateId,
  ]);

  return (
    <GenerateWriteUpDialogContext.Provider value={context}>
      {children}
    </GenerateWriteUpDialogContext.Provider>
  );
};
