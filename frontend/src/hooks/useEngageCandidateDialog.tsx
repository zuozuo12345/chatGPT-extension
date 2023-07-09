import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  USER_DETAILS_DATA_TYPE,
  USER_SESSION_DATA_TYPE,
} from "../typescript/types/user";

interface EngageCandidateDialogContextProviderType {
  show?: boolean;
  children?: React.ReactNode;
  openEngageCandidateDialog?: (
    args: openEngageCandidateDialogType
  ) => void | null;
  closeEngageCandidateDialog?: () => void | null;
  callbackFunctions?: callbackFunctionsType;
  proceedText?: string | null;
  recommendationId?: string | null;
  sessionData?: USER_SESSION_DATA_TYPE;
}

interface callbackFunctionsType {
  proceed: () => void | null;
  cancel: () => void | null;
}

interface openEngageCandidateDialogType {
  callbackFunc?: callbackFunctionsType;
  proceedText?: string | null;
  recommendationId?: string | null;
  sessionData?: USER_SESSION_DATA_TYPE;
}

const defaultValue: EngageCandidateDialogContextProviderType = {
  show: false,
  openEngageCandidateDialog: () => {},
  closeEngageCandidateDialog: () => {},
  callbackFunctions: null,
};

interface dialogContentsStateType {
  proceedText?: string | null;
}

export const EngageCandidateDialogContext = createContext(defaultValue);

export const useEngageCandidateDialog = () => {
  return useContext(EngageCandidateDialogContext);
};

export const EngageCandidateDialogContextProvider = ({
  children,
}: EngageCandidateDialogContextProviderType) => {
  const [open, setOpen] = useState<boolean>(false);
  const [callbackFunctions, setCallbackFunctions] =
    useState<callbackFunctionsType>({
      proceed: null,
      cancel: null,
    });
  const [dialogContents, setDialogContents] = useState<dialogContentsStateType>(
    {
      proceedText: "Send Email",
    }
  );
  const [recommendationId, setRecommendationId] = useState<string>(null);
  const [sessionData, setSessionData] = useState<USER_SESSION_DATA_TYPE>(null);

  const handleClickOpen = (args: openEngageCandidateDialogType) => {
    const { callbackFunc = null, proceedText = null } = args;

    setOpen(true);

    if (proceedText !== null) {
      setDialogContents({
        proceedText: proceedText,
      });
    }

    if (callbackFunc !== null) {
      setCallbackFunctions({
        proceed: callbackFunc.proceed,
        cancel: callbackFunc.cancel,
      });
    }

    if (
      args.recommendationId !== null &&
      args.recommendationId !== undefined &&
      args.recommendationId.replace(/\s/g, "") !== ""
    ) {
      setRecommendationId(args.recommendationId);
    }

    if (args.sessionData) {
      setSessionData(args.sessionData);
    }
  };

  const handleClose = () => {
    setOpen(false);

    setCallbackFunctions({
      proceed: null,
      cancel: null,
    });
  };

  useEffect(() => {
    if (!open) {
      // Clear dialog contents after its closed for 250ms
      setTimeout(() => {
        setDialogContents({
          proceedText: "Send Email",
        });

        setRecommendationId(null);
      }, 250);
    }
  }, [open]);

  // Context values
  const context = useMemo(() => {
    return {
      show: open,
      proceedText: dialogContents.proceedText,
      openEngageCandidateDialog: (args: openEngageCandidateDialogType) => {
        const { callbackFunc = null, proceedText = null } = args;

        handleClickOpen({
          callbackFunc,
          proceedText,
          recommendationId:
            args.recommendationId !== null &&
            args.recommendationId !== undefined &&
            args.recommendationId.replace(/\s/g, "") !== ""
              ? args.recommendationId
              : null,
          sessionData:
            args.sessionData !== null && args.sessionData !== undefined
              ? args.sessionData
              : null,
        });
      },
      closeEngageCandidateDialog: handleClose,
      callbackFunctions,
      recommendationId,
      sessionData,
    };
  }, [
    open,
    handleClickOpen,
    handleClose,
    callbackFunctions,
    dialogContents.proceedText,
    recommendationId,
    sessionData,
  ]);

  return (
    <EngageCandidateDialogContext.Provider value={context}>
      {children}
    </EngageCandidateDialogContext.Provider>
  );
};
