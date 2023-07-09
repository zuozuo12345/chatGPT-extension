import React, { useEffect, useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

import { useEngageCandidateDialog } from "../../../hooks/useEngageCandidateDialog";
import { SCOUT_WEB_URL } from "../../../scripts/scout/settings";
import { fetchIfConnectedToMsal } from "../../../api/scout/user/fetch";
import { HeroIconContainer, MainButton } from "../../common";
import OutlookLogo from "../../../assets/icons/outlook_logo.webp";
import { useSessionUser } from "../../../hooks/useSessionUser";

export default function EngageCandidateDialog() {
  const {
    show,
    callbackFunctions,
    closeEngageCandidateDialog,
    proceedText,
    recommendationId,
  } = useEngageCandidateDialog();
  const { accessToken } = useSessionUser();

  const [ready, setReady] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedemailProvider, setSelectedEmailProvider] = useState<
    "msal" | "gmail" | null
  >(null);

  /**
   * @desc Function to close dialog
   */
  const handleClose = () => {
    closeEngageCandidateDialog();

    setTimeout(() => {
      setSubmitting(false);
    }, 250);
  };

  /**
   * @desc Callback function when user clicks proceed button
   */
  const proceedOnClick = async () => {
    if (step === 1) {
      // const jobId = router.query["jobId"] ? `${router.query["jobId"]}` : null;

      if (recommendationId) {
        setSubmitting(true);

        window.open(`${SCOUT_WEB_URL}api/msal/sign-in`);
      }
    } else {
      if (callbackFunctions.proceed !== null && !submitting) {
        setSubmitting(true);

        try {
          await callbackFunctions.proceed();
        } catch (err) {
          console.log(err);
        }
      }

      handleClose();
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

  useEffect(() => {
    const init = async () => {
      try {
        const { isConnectedToMsal } = await fetchIfConnectedToMsal({
          access_token: accessToken,
        });

        if (isConnectedToMsal) {
          setStep(2);
        }
      } catch (error) {}

      setReady(true);
    };

    if (show) {
      init();
    } else {
      setTimeout(() => {
        setStep(1);
        setReady(false);
      }, 500);
    }
  }, [show]);

  const MicrosoftOutlookIntegrationBtn = useMemo(() => {
    const outlookBtnOnClick = async () => {
      setSelectedEmailProvider(
        selectedemailProvider === "msal" ? null : "msal"
      );
    };

    return ready ? (
      <Box
        sx={{
          color: (theme) => theme.customPalette.grey.base,
          pt: 1.25,
          pb: 1.5,
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          sx={{
            color: (theme) =>
              selectedemailProvider === "msal"
                ? theme.palette.primary.main
                : theme.customPalette.grey.base,
            textTransform: "none",
            borderColor: (theme) =>
              selectedemailProvider === "msal"
                ? theme.palette.primary.main
                : theme.customPalette.grey.light_grey,
            bgcolor: (theme) =>
              selectedemailProvider === "msal"
                ? theme.palette.primary.light
                : "transparent",
            fontWeight: (theme) =>
              selectedemailProvider === "msal" ? "bold" : "normal",
            "&:hover": {
              bgcolor: (theme) =>
                selectedemailProvider === "msal"
                  ? theme.palette.primary.light
                  : "transparent",
            },
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
          onClick={outlookBtnOnClick}
        >
          Microsoft Outlook
        </Button>
      </Box>
    ) : null;
  }, [ready, selectedemailProvider]);

  const SkeletonComp = useMemo(() => {
    return (
      <Box>
        <Box
          sx={{
            pb: (theme) => theme.spacing(3),
          }}
        >
          <CustomSkeleton variant="rectangular" width={"100%"} height={36} />
        </Box>
        <Box
          sx={{
            mb: (theme) => theme.spacing(3),
          }}
        >
          <Stack spacing={1}>
            <CustomSkeleton variant="rectangular" width={"100%"} height={18} />
            <CustomSkeleton variant="rectangular" width={"100%"} height={18} />
            <CustomSkeleton variant="rectangular" width={"100%"} height={18} />
          </Stack>
        </Box>
        <Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <CustomSkeleton variant="rectangular" width={80} height={36} />
            <CustomSkeleton variant="rectangular" width={80} height={36} />
          </Stack>
        </Box>
      </Box>
    );
  }, []);

  const TitleAndContentComp = useMemo(() => {
    return (
      <>
        <StyledDialogTitle variant="h6">
          {step === 1 ? "Setup email account with Scout" : "Email Candidate"}
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledDialogContentText
            variant="body2"
            variantMapping={{ body2: "div" }}
          >
            {step === 1 ? (
              "Increase candidates response rate by connecting your email! Scout will use your email account to send emails to your candidates using email templates provided."
            ) : (
              <>
                {
                  "By clicking on ‘Send Email’, Scout will automatically reach out with 2 follow-up emails if no response received. You will receive any responses directly in the Inbox of your email."
                }
              </>
            )}
          </StyledDialogContentText>
        </StyledDialogContent>
      </>
    );
  }, [step]);

  return (
    <StyledDialog
      open={show}
      onClose={cancelOnClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {ready ? (
        <>
          {TitleAndContentComp}
          {step === 1 && MicrosoftOutlookIntegrationBtn}
          <StyledDialogActions>
            <MainButton variant="text" onClick={cancelOnClick}>
              {"Cancel"}
            </MainButton>
            <MainButton
              sx={{ py: 1 }}
              onClick={proceedOnClick}
              disabled={
                submitting || (step === 1 ? !selectedemailProvider : false)
              }
            >
              {step === 1
                ? "Continue"
                : proceedText !== null
                ? proceedText
                : `Send Email`}
            </MainButton>
          </StyledDialogActions>
        </>
      ) : (
        SkeletonComp
      )}
    </StyledDialog>
  );
}

const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.customPalette.grey.light_grey,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow: "none",
    border: `1px solid ${theme.customPalette.grey.light_grey}`,
    borderRadius: 6,
    overflow: "hidden",
    padding: "24px",
    maxWidth: 500,
    width: "100%",
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

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: theme.typography.body2.fontSize,
  },
}));
