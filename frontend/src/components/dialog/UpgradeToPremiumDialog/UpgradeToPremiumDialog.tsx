import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

import { MainButton } from "../../common";
import { useUpgradeToPremiumDialog } from "../../../hooks/useUpgradeToPremiumDialog";
import { SCOUT_WEB_URL } from "../../../scripts/scout/settings";

/**
 * @desc The confirmation dialog component for any alert or confirmation pop up.
 * - [Material UI Dialog documentation](https://mui.com/material-ui/react-dialog/#main-content)
 * - [Material UI Dialog API documentation](https://mui.com/material-ui/api/dialog/)
 */
export default function UpgradeToPremiumDialog() {
  const { show, featureName, callbackFunctions, closeUpgradeToPremiumDialog } =
    useUpgradeToPremiumDialog();

  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * @desc Function to close dialog
   */
  const handleClose = () => {
    closeUpgradeToPremiumDialog();

    setTimeout(() => {
      setSubmitting(false);
    }, 250);
  };

  /**
   * @desc Callback function when user clicks proceed button
   */
  const proceedOnClick = async () => {
    if (callbackFunctions.proceed !== null && !submitting) {
      setSubmitting(true);

      try {
        await callbackFunctions.proceed();
      } catch (err) {
        console.log(err);
      }
    }

    window.open(`${SCOUT_WEB_URL}settings/subscription`);

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
    <StyledDialog open={show} onClose={cancelOnClick}>
      <StyledDialogTitle variant="h5">
        {`${
          featureName ? featureName : "This feature"
        } is only available to premium users`}
      </StyledDialogTitle>
      <StyledDialogContent>
        <StyledDialogContentText
          variant="body2"
          variantMapping={{ body2: "div" }}
        >
          {"Upgrade your subscription plan to access this feature."}
        </StyledDialogContentText>
      </StyledDialogContent>
      <StyledDialogActions>
        <MainButton
          sx={{ py: 1 }}
          onClick={proceedOnClick}
          disabled={submitting}
        >
          {"Upgrade to Premium"}
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
  fontSize: "1.32rem",
  fontWeight: "bold",
  padding: 0,
  paddingBottom: theme.spacing(2),
  textAlign: "center",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: `${theme.spacing(2)} 0`,
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.customPalette.grey.base,
  padding: 0,
  textAlign: "center",
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: `0`,
  paddingTop: theme.spacing(2),
  justifyContent: "center",
}));
