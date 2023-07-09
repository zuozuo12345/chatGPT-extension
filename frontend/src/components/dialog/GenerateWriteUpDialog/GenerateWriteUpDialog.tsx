import React, { useMemo, useState, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box, { BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import CircleIcon from "@mui/icons-material/Circle";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Slider from "../../../modules/react-spring-slider";

import { useGenerateWriteUpDialog } from "../../../hooks/useGenerateWriteUpDialog";
import Image1 from "../../../assets/background/gwu-1.webp";
import Image2 from "../../../assets/background/gwu-2.webp";
import {
  StyledCheckbox,
  StyledFormControlLabel,
} from "../../common/customCheckbox";
import { MainButton } from "../../common";

export default function GenerateWriteUpDialog() {
  const {
    show,
    closeGenerateWriteUpDialog,
    callbackFunctions,
    recommendedCandidateId,
  } = useGenerateWriteUpDialog();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    closeGenerateWriteUpDialog();

    setTimeout(() => {
      setSubmitting(false);
      setCheckboxChecked(false);
    }, 250);
  }, []);

  const cancelOnClick = useCallback(async () => {
    if (callbackFunctions.cancel !== null) {
      await callbackFunctions.cancel();
    }

    handleClose();
  }, []);

  const setSlideCustom = useCallback(
    (slideNumber: number) => {
      setCurrentSlide(slideNumber);

      return slideNumber;
    },
    [currentSlide]
  );

  const circleButtonOnClick = useCallback((slideNumber: number) => {
    setCurrentSlide(slideNumber);
  }, []);

  const ImageSliderComp = useMemo(() => {
    return (
      <Box
        sx={{
          width: "100%",
          height: 242,
          borderRadius: 1.5,
          overflow: "hidden",
          position: "relative",
          top: "-24px",
        }}
      >
        <Slider
          auto={show ? 5000 : 0}
          activeIndex={currentSlide}
          setSlideCustom={setSlideCustom}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={Image1}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={Image2}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Slider>
      </Box>
    );
  }, [currentSlide, show]);

  const CircleDotContainerComp = useMemo(() => {
    return (
      <Box
        sx={{
          fontSize: "0.65rem",
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center">
          <CircleDotContainer active={currentSlide === 0}>
            <CircleDotIconButton
              size="small"
              onClick={() => circleButtonOnClick(0)}
            >
              <CircleIcon fontSize="inherit" />
            </CircleDotIconButton>
          </CircleDotContainer>
          <CircleDotContainer active={currentSlide === 1}>
            <CircleDotIconButton
              size="small"
              onClick={() => circleButtonOnClick(1)}
            >
              <CircleIcon fontSize="inherit" />
            </CircleDotIconButton>
          </CircleDotContainer>
        </Stack>
      </Box>
    );
  }, [currentSlide]);

  const ContentComp = useMemo(() => {
    return (
      <ContentTextContainer
        sx={{
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography fontWeight="bold">{"Generate a write-up"}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              Quickly and easily generate a write-up for a candidate based on
              their current experience in comparison to the job you're scouting
              for.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "inline-block",
            }}
          >
            <Typography variant="body2" component="span" fontWeight="bold">
              {"Disclaimer*: "}
            </Typography>
            <Typography variant="body2" component="span">
              {
                "This write-up is generated using OpenAI's large-scale language-generation model in collaboration with information from Scout's AI-powered sourcing engine. Some information generated may or may not be 100% true."
              }
            </Typography>
          </Box>
        </Stack>
      </ContentTextContainer>
    );
  }, []);

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
          label="I read and understand"
        />
      </FormGroup>
    );
  }, [checkboxChecked]);

  const CtaComp = useMemo(() => {
    const generateOnClick = async () => {
      try {
        if (recommendedCandidateId && !submitting) {
          setSubmitting(true);

          if (callbackFunctions.proceed !== null) {
            await callbackFunctions.proceed();
          }

          handleClose();
        }
      } catch (error) {
        console.log(error);
      }

      setSubmitting(false);
    };

    return (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              flexBasis: "50%",
            }}
          >
            <MainButton
              variant="text"
              fullWidth
              size="large"
              onClick={cancelOnClick}
            >
              Back
            </MainButton>
          </Box>
          <Box
            sx={{
              flexBasis: "50%",
            }}
          >
            <MainButton
              borderRadius={20}
              fullWidth
              size="large"
              disabled={!checkboxChecked || submitting}
              onClick={generateOnClick}
              startIcon={
                submitting ? (
                  <CircularProgress size={15} color="inherit" />
                ) : null
              }
            >
              Generate
            </MainButton>
          </Box>
        </Stack>
      </Box>
    );
  }, [
    checkboxChecked,
    recommendedCandidateId,
    callbackFunctions.proceed,
    submitting,
  ]);

  return (
    <StyledDialog open={show} onClose={cancelOnClick} scroll="body">
      <StyledDialogContent>
        {ImageSliderComp}
        <Box
          sx={{
            position: "relative",
            top: "-24px",
          }}
        >
          <Stack spacing={2}>
            {CircleDotContainerComp}
            {ContentComp}
            {CheckBoxComp}
            {CtaComp}
          </Stack>
        </Box>
      </StyledDialogContent>
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
    width: "100%",
    maxWidth: 431,
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: `0`,
}));

interface CircleDotContainerProps extends BoxProps {
  active?: boolean;
}

const CircleDotContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<CircleDotContainerProps>(({ theme, active = false }) => ({
  color: active
    ? theme.palette.primary.main
    : theme.customPalette.grey.light_grey,
}));

const CircleDotIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: "0.65rem",
  color: "inherit",
}));

const ContentTextContainer = styled(Box)(({ theme }) => ({
  color: theme.customPalette.grey.dim,
}));
