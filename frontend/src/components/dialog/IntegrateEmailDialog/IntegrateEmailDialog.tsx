import React, { useState, useMemo, useCallback, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { useIntegrateEmailDialog } from "../../../hooks/useIntegrateEmailDialog";
import { HeroIconContainer, MainButton } from "../../common";
import {
  StyledCheckbox,
  StyledFormControlLabel,
} from "../../common/customCheckbox";
import OutlookLogo from "../../../assets/icons/outlook_logo.webp";

/**
 * @desc The confirmation dialog component for any alert or confirmation pop up.
 * - [Material UI Dialog documentation](https://mui.com/material-ui/react-dialog/#main-content)
 * - [Material UI Dialog API documentation](https://mui.com/material-ui/api/dialog/)
 */
export default function IntegrateEmailDialog() {
  const { show, callbackFunctions, closeIntegrateEmailDialog, sessionDetails } =
    useIntegrateEmailDialog();

  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (!show && currentStep === 2) {
      setTimeout(() => {
        setCurrentStep(1);
        setCheckboxChecked(false);
      }, 500);
    }
  }, [show, currentStep]);

  /**
   * @desc Function to close dialog
   */
  const handleClose = () => {
    closeIntegrateEmailDialog();
  };

  /**
   * @desc Callback function when user clicks proceed button
   */
  const proceedOnClick = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      console.log("1");
    } else if (currentStep === 2) {
      console.log("2");
    }

    if (callbackFunctions.proceed !== null) {
      await callbackFunctions.proceed();
    }
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

  const changeStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const skipAndContinue = useCallback(async () => {}, [checkboxChecked]);

  const CheckBoxComp = useMemo(() => {
    const handleCheckboxOnChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setCheckboxChecked(event.target.checked);
    };

    return (
      <FormGroup>
        <StyledFormControlLabel
          control={
            <StyledCheckbox
              onChange={handleCheckboxOnChange}
              checked={checkboxChecked}
              size="small"
            />
          }
          label="Don't ask me again"
        />
      </FormGroup>
    );
  }, [checkboxChecked]);

  const MicrosoftOutlookIntegrationBtn = useMemo(() => {
    return (
      <Box
        sx={{
          color: (theme) => theme.customPalette.grey.base,
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          sx={{
            color: (theme) => theme.customPalette.grey.base,
            textTransform: "none",
            borderColor: (theme) => theme.customPalette.grey.light_grey,
          }}
          startIcon={
            <HeroIconContainer width={20}>
              <img
                src={OutlookLogo}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </HeroIconContainer>
          }
          fullWidth
          size="large"
          disableFocusRipple
          disableElevation
        >
          Microsoft Outlook
        </Button>
      </Box>
    );
  }, []);

  return (
    <StyledDialog
      open={show}
      onClose={cancelOnClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle id="alert-dialog-title" variant="h6">
        {currentStep === 1 ? "Integrate Email" : "Engage Candidate"}
      </StyledDialogTitle>
      <StyledDialogContent>
        <StyledDialogContentText
          id="alert-dialog-description"
          variant="body2"
          variantMapping={{ body2: "span" }}
          sx={{ display: "inline-block" }}
        >
          {currentStep === 1 ? (
            "Do more for less! By integrating your email, Scout can send emails out on your behalf and utilise pre-crafted email templates hassle-free."
          ) : (
            <>
              <span>
                {
                  "By clicking on 'Engage', Scout will engage the selected candidate(s) using the defined"
                }
              </span>
              <Box
                component="span"
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  textDecoration: "underline",
                }}
              >
                email templates
              </Box>
              <span>{" on the behalf of "}</span>
              <Box
                component="span"
                sx={{
                  fontWeight: "bold",
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                {`${
                  sessionDetails && sessionDetails.email
                    ? sessionDetails.email
                    : ""
                }`}
              </Box>
              <span>
                {". You will receive any responses directly in your inbox."}
              </span>
            </>
          )}
        </StyledDialogContentText>
        {currentStep === 1 && (
          <Box
            sx={{
              mt: 2,
            }}
          >
            {MicrosoftOutlookIntegrationBtn}
          </Box>
        )}
        {currentStep === 1 && (
          <Box
            sx={{
              mt: 2,
            }}
          >
            {CheckBoxComp}
          </Box>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <MainButton variant="text" onClick={cancelOnClick}>
          {`Cancel`}
        </MainButton>
        <MainButton sx={{ py: 1 }} onClick={proceedOnClick}>
          {currentStep === 1 ? `Skip & Continue` : "Engage"}
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
