import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

import { useConfirmationDialog } from "../../../hooks/useConfirmationDialog";
import { MainButton } from "../../common";

/**
 * @desc The confirmation dialog component for any alert or confirmation pop up.
 * - [Material UI Dialog documentation](https://mui.com/material-ui/react-dialog/#main-content)
 * - [Material UI Dialog API documentation](https://mui.com/material-ui/api/dialog/)
 */
export default function ConfirmationDialog() {
  const {
    title,
    contents,
    proceedText,
    cancelText,
    show,
    callbackFunctions,
    closeConfirmationDialog,
  } = useConfirmationDialog();

  /**
   * @desc Function to close dialog
   */
  const handleClose = () => {
    closeConfirmationDialog();
  };

  /**
   * @desc Callback function when user clicks proceed button
   */
  const proceedOnClick = async () => {
    if (callbackFunctions.proceed !== null) {
      await callbackFunctions.proceed();
    }

    handleClose();
  };

  /**
   * @desc Callback function when user clicks cancel button
   */
  const cancelOnClick = async () => {
    if (callbackFunctions.cancel !== null) {
      await callbackFunctions.cancel();
    }

    handleClose();
  };

  return (
    <StyledDialog
      open={show}
      onClose={cancelOnClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle id="alert-dialog-title" variant="h6">
        {title !== null ? title : "Use Google's location service?"}
      </StyledDialogTitle>
      <StyledDialogContent>
        <StyledDialogContentText
          id="alert-dialog-description"
          variant="body2"
          variantMapping={{ body2: "div" }}
        >
          {contents !== null
            ? contents
            : "Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running."}
        </StyledDialogContentText>
      </StyledDialogContent>
      <StyledDialogActions>
        {cancelText !== null && cancelText !== "" && (
          <MainButton variant="text" onClick={cancelOnClick}>
            {cancelText !== null ? cancelText : `Disagree`}
          </MainButton>
        )}
        <MainButton sx={{ py: 1 }} onClick={proceedOnClick}>
          {proceedText !== null ? proceedText : `Agree`}
        </MainButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow: "none",
    border: `1px solid ${theme.customPalette.grey.light_grey}`,
    borderRadius: 6,
    overflow: "hidden",
    padding: "24px",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "bold",
  padding: 0,
  paddingBottom: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: `${theme.spacing(2)} 0`,
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.customPalette.grey.base,
  padding: 0,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: `0`,
  paddingTop: theme.spacing(2),
}));
