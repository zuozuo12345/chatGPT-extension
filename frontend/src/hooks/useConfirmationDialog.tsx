import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

interface ConfirmationDialogContextProviderType {
  title?: string | null;
  contents?: React.ReactNode | null;
  proceedText?: string | null;
  cancelText?: string | null;
  show?: boolean;
  children?: React.ReactNode;
  openConfirmationDialog?: (args: openConfirmationDialogType) => void | null;
  closeConfirmationDialog?: () => void | null;
  callbackFunctions?: callbackFunctionsType;
}

interface openConfirmationDialogType {
  title?: string | null;
  contents?: React.ReactNode | null;
  proceedText?: string | null;
  cancelText?: string | null;
  callbackFunc?: {
    proceed: () => void | null;
    cancel: () => void | null;
  } | null;
}

interface dialogContentsStateType {
  title?: string | null;
  contents?: React.ReactNode | null;
  proceedText?: string | null;
  cancelText?: string | null;
}

interface callbackFunctionsType {
  proceed: () => void | null;
  cancel: () => void | null;
}

// Confirmation dialog context default value
const defaultValue: ConfirmationDialogContextProviderType = {
  title: null,
  contents: null,
  show: false,
  openConfirmationDialog: () => {},
  closeConfirmationDialog: () => {},
  callbackFunctions: null,
};

/**
 * @desc Creates a react context object.
 * - [React createContext documentation](https://reactjs.org/docs/context.html#reactcreatecontext)
 */
export const ConfirmationDialogContext = createContext(defaultValue);

/**
 * @desc Utilise react useContext hook.
 * - [React useContext documentation](https://reactjs.org/docs/hooks-reference.html#usecontext)
 */
export const useConfirmationDialog = () => {
  return useContext(ConfirmationDialogContext);
};

/**
 * @desc A provider react component that allows consuming components to subscribe to context changes
 * - [React context documentation](https://reactjs.org/docs/context.html)
 */
export const ConfirmationDialogContextProvider = ({
  children,
}: ConfirmationDialogContextProviderType) => {
  const [open, setOpen] = useState(false);
  const [dialogContents, setDialogContents] = useState<dialogContentsStateType>(
    {
      title: "",
      contents: "",
      proceedText: "Ok",
      cancelText: "Cancel",
    }
  );
  const [callbackFunctions, setCallbackFunctions] =
    useState<callbackFunctionsType>({
      proceed: null,
      cancel: null,
    });

  const handleClickOpen = ({
    title,
    contents,
    proceedText,
    cancelText,
    callbackFunc,
  }: openConfirmationDialogType) => {
    setOpen(true);

    if (title !== null && contents !== null) {
      setDialogContents({
        title,
        contents,
        proceedText,
        cancelText,
      });
    }

    if (callbackFunc !== null) {
      setCallbackFunctions({
        proceed: callbackFunc.proceed,
        cancel: callbackFunc.cancel,
      });
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
          title: "",
          contents: "",
          proceedText: "Ok",
          cancelText: "Cancel",
        });
      }, 250);
    }
  }, [open]);

  // Context values
  const context = useMemo(() => {
    return {
      title: dialogContents.title,
      contents: dialogContents.contents,
      proceedText: dialogContents.proceedText,
      cancelText: dialogContents.cancelText,
      show: open,
      openConfirmationDialog: ({
        title = null,
        contents = null,
        proceedText = "Ok",
        cancelText = "Cancel",
        callbackFunc = null,
      }: openConfirmationDialogType) =>
        handleClickOpen({
          title,
          contents,
          proceedText,
          cancelText,
          callbackFunc,
        }),
      closeConfirmationDialog: handleClose,
      callbackFunctions,
    };
  }, [open, dialogContents, callbackFunctions, handleClickOpen, handleClose]);

  return (
    <ConfirmationDialogContext.Provider value={context}>
      {children}
    </ConfirmationDialogContext.Provider>
  );
};
