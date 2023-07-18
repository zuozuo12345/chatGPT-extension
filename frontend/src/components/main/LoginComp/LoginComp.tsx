import React, { useState, useCallback, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import moment from "moment";

import {
  FlashBanner,
  flashBannerModeType,
  HeroIconContainer,
  MainButton,
  TextInput,
} from "../../common";
import { getOtpCode, userLogin } from "../../../api/scout/auth/login";
import {
  getLoginProcessStorage,
  getScoutWebTokenStorage,
  getSessionTypeStorage,
  setLoginProcessStorage,
  setSessionTypeStorage,
} from "../../../utils/storage";

type currentStepType = "email" | "otp";

export default function LoginComp() {
  const [flashBannerMessage, setFlashBannerMessage] = useState<{
    message: React.ReactNode;
    mode: flashBannerModeType;
  }>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<currentStepType>("email");
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [showResendBtn, setShowResendBtn] = useState<boolean>(false);

  const setNewStep = useCallback(
    (value: currentStepType) => {
      if (setCurrentStep !== null) {
        setCurrentStep(value);
      }
    },
    [currentStep]
  );

  const onFormSubmit = async (values: formikValuesInterface, { setErrors }) => {
    try {
      const { email, otp } = values;

      if (showResendBtn) {
        setShowResendBtn(false);
      }

      if (currentStep === "email") {
        if (flashBannerMessage) {
          setFlashBannerMessage(null);
        }

        await getOtpCode({
          email,
        });

        await setLoginProcessStorage(email, moment());

        setNewStep("otp");
        setFlashBannerMessage({
          message: (
            <>
              {`An OTP has been sent to your email `}
              <Typography
                variant="body2"
                color="primary"
                variantMapping={{
                  body2: "span",
                }}
                sx={{
                  fontWeight: "700",
                }}
              >
                {`${email}`}
              </Typography>
              {` and expires in 5 minutes.`}
            </>
          ),
          mode: "normal",
        });
      } else if (currentStep === "otp") {
        const { token } = await userLogin({ phone: email, code: otp });

        await setLoginProcessStorage(null, null);

        chrome.storage.sync.set({ scoutWebToken: token ?? null });
        setSessionTypeStorage("local");
      }
    } catch (e) {
      if (currentStep === "otp") {
        const err = e as AxiosError;

        if (
          err.response &&
          err.response.data &&
          err.response.data["message"] &&
          typeof err.response.data["message"] === "string"
        ) {
          setFlashBannerMessage({
            message: err.response.data["message"],
            mode: "error",
          });

          if (
            err.response.data["message"] ===
            "Your OTP has expired, please try again."
          ) {
            setShowResendBtn(true);
          }
        } else {
          setFlashBannerMessage({
            message: (
              <>
                {`You've entered an incorrect OTP.`}
                <br />
                {`Please try again.`}
              </>
            ),
            mode: "error",
          });
        }
      } else {
        setFlashBannerMessage({
          message: typeof e === "string" ? e : e.toString(),
          mode: "error",
        });
      }
    }
  };

  const formFormik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema: FormSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: onFormSubmit,
  });

  const {
    values,
    setFieldValue,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formFormik;

  useEffect(() => {
    const init = async () => {
      const getSessionTypeStorageResponse = await getSessionTypeStorage();
      const getScoutWebTokenStorageResponse = await getScoutWebTokenStorage();

      const getLoginProcessStorageResponse = await getLoginProcessStorage();

      if (
        getSessionTypeStorageResponse === "local" &&
        !getScoutWebTokenStorageResponse
      ) {
        setSessionTypeStorage("scout_web_app");
      }

      if (getLoginProcessStorageResponse) {
        setFieldValue(
          "email",
          getLoginProcessStorageResponse.loginProcess.email
        );

        setCurrentStep("otp");
        setFlashBannerMessage({
          message: (
            <>
              {`An OTP has been sent to your email `}
              <Typography
                variant="body2"
                color="primary"
                variantMapping={{
                  body2: "span",
                }}
                sx={{
                  fontWeight: "700",
                }}
              >
                {`${getLoginProcessStorageResponse.loginProcess.email}`}
              </Typography>
              {` and expires in 5 minutes.`}
            </>
          ),
          mode: "normal",
        });
      }
    };

    init();
  }, []);

  const resendOnClick = useCallback(async () => {
    if (showResendBtn) {
      await getOtpCode({
        email: values.email,
      });

      setFlashBannerMessage({
        message: (
          <>
            {`An OTP has been sent to your email `}
            <Typography
              variant="body2"
              color="primary"
              variantMapping={{
                body2: "span",
              }}
              sx={{
                fontWeight: "700",
              }}
            >
              {`${values.email}.`}
            </Typography>
            {` and expires in 5 minutes.`}
          </>
        ),
        mode: "normal",
      });

      setShowResendBtn(false);
    }
  }, [showResendBtn, values.email]);

  const FlashBannerComp = useMemo(() => {
    return flashBannerMessage && flashBannerMessage.message ? (
      <FlashBanner
        message={
          <Box component="span">
            <span>{flashBannerMessage.message}</span>
            {showResendBtn && (
              <span
                style={{
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "inherit",
                  cursor: "grab",
                }}
                onClick={resendOnClick}
              >
                Resend
              </span>
            )}
          </Box>
        }
        mode={
          flashBannerMessage && flashBannerMessage.mode
            ? flashBannerMessage.mode
            : null
        }
        borderRadius={8}
      />
    ) : null;
  }, [flashBannerMessage, showResendBtn]);

  const EmailTextInput = useMemo(
    () => (
      <TextInput
        autoFocus
        label="Email*"
        size="small"
        placeholder="e.g. johndoe@gmail.com"
        onBlur={handleBlur}
        onChange={handleChange}
        name="email"
        value={values.email}
        error={"email" in errors}
        helperText={"email" in errors ? errors["email"] : ""}
        endAdornment={
          <HeroIconContainer width={28}>
            <EnvelopeIcon />
          </HeroIconContainer>
        }
      />
    ),
    [values.email, errors.email]
  );

  const OtpTextInput = useMemo(
    () => (
      <TextInput
        autoFocus
        label="OTP*"
        size="small"
        placeholder="e.g. 12345"
        onBlur={handleBlur}
        onChange={handleChange}
        name="otp"
        value={values.otp}
        error={"otp" in errors}
        helperText={"otp" in errors ? errors["otp"] : ""}
        endAdornment={
          <HeroIconContainer width={28}>
            <KeyIcon />
          </HeroIconContainer>
        }
      />
    ),
    [values.otp, errors.otp]
  );

  const SubmitButtonComp = useMemo(
    () => (
      <MainButton
        type="submit"
        disabled={disableButton || isSubmitting}
        sx={{
          mt: 1,
        }}
        fullWidth
        size="medium"
        borderRadius={8}
      >
        {currentStep === "email" ? "Request OTP emails" : "Sign In"}
      </MainButton>
    ),
    [currentStep, disableButton, isSubmitting]
  );

  const ResendButtonComp = useMemo(
    () =>
      currentStep === "otp" ? (
        <MainButton
          type="button"
          fullWidth
          size="small"
          variant="text"
          onClick={resendOnClick}
          sx={{
            mt: 2.5,
          }}
        >
          {"Resend OTP"}
        </MainButton>
      ) : null,
    [currentStep, showResendBtn, values.email]
  );

  useEffect(() => {
    if (
      values.email.replace(" ", "") !== "" &&
      Yup.string().email().isValidSync(values.email)
    ) {
      if (disableButton) {
        setDisableButton(false);
      }
    } else {
      if (!disableButton) {
        setDisableButton(true);
      }
    }
  }, [values.email]);

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "bold",
        }}
      >
        Welcome to ChatGPT AI Extension!
      </Typography>
      <Typography variant="body2">{`Please sign in to proceed`}</Typography>
      <Box
        sx={{
          pt: 0.75,
          pb: currentStep === "otp" ? 1 : 2,
          maxWidth: 400,
          m: "0 auto",
        }}
      >
        <Box sx={{ pt: 1, pb: 1.25 }}>{FlashBannerComp}</Box>
        <form style={{ height: "100%" }} onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {currentStep === "email" && EmailTextInput}
            {currentStep === "otp" && OtpTextInput}
            {SubmitButtonComp}
          </Stack>
        </form>
        {/* {ResendButtonComp} */}
      </Box>
    </Box>
  );
}

interface formikValuesInterface {
  email: string;
  otp: string;
}

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .email("You've entered an invalid email address.")
    .required("Email address is required"),
});

const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.customPalette.grey.light_grey,
}));
