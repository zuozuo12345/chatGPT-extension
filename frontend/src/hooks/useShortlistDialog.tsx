import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

type dialogType = "shortlist" | "remove_from_shortlist";

interface ShortlistDialogContextProviderType {
  show?: boolean;
  children?: React.ReactNode;
  openShortlistDialog?: (args: openShortlistDialogType) => void | null;
  closeShortlistDialog?: () => void | null;
  callbackFunctions?: callbackFunctionsType;
  mode?: dialogType;
}

interface openShortlistDialogType {
  callbackFunc?: {
    proceed: () => void | null;
    cancel: () => void | null;
  } | null;
  mode?: dialogType;
}

interface callbackFunctionsType {
  proceed: () => void | null;
  cancel: () => void | null;
}

// Confirmation dialog context default value
const defaultValue: ShortlistDialogContextProviderType = {
  show: false,
  openShortlistDialog: () => {},
  closeShortlistDialog: () => {},
  callbackFunctions: null,
};

/**
 * @desc Creates a react context object.
 * - [React createContext documentation](https://reactjs.org/docs/context.html#reactcreatecontext)
 */
export const ShortlistDialogContext = createContext(defaultValue);

/**
 * @desc Utilise react useContext hook.
 * - [React useContext documentation](https://reactjs.org/docs/hooks-reference.html#usecontext)
 */
export const useShortlistDialog = () => {
  return useContext(ShortlistDialogContext);
};

/**
 * @desc A provider react component that allows consuming components to subscribe to context changes
 * - [React context documentation](https://reactjs.org/docs/context.html)
 */
export const ShortlistDialogContextProvider = ({
  children,
}: ShortlistDialogContextProviderType) => {
  const [open, setOpen] = useState(false);
  const [callbackFunctions, setCallbackFunctions] =
    useState<callbackFunctionsType>({
      proceed: null,
      cancel: null,
    });
  const [dialogMode, setDialogMode] = useState<dialogType>("shortlist");

  const handleClickOpen = ({ callbackFunc, mode }: openShortlistDialogType) => {
    setOpen(true);
    setCallbackFunctions(callbackFunc);
    setDialogMode(mode);
  };

  const handleClose = () => {
    setOpen(false);
    setCallbackFunctions({
      proceed: null,
      cancel: null,
    });

    setTimeout(() => {
      setDialogMode("shortlist");
    }, 500);
  };

  // Context values
  const context = useMemo(() => {
    return {
      show: open,
      openShortlistDialog: ({
        callbackFunc = null,
        mode = "shortlist",
      }: openShortlistDialogType) =>
        handleClickOpen({
          callbackFunc,
          mode,
        }),
      closeShortlistDialog: handleClose,
      callbackFunctions,
      mode: dialogMode,
    };
  }, [open, callbackFunctions, dialogMode, handleClickOpen, handleClose]);

  return (
    <ShortlistDialogContext.Provider value={context}>
      {children}
    </ShortlistDialogContext.Provider>
  );
};
