import React, { useState } from "react";
import Paper, { PaperProps } from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import {
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { HeroIconContainer } from "../customContainer";

/**
 * @desc Flash banner component that allows alert messages to be shown on the UI
 */
export default function FlashBanner(props: flashBannerPropsInterface) {
  const {
    message,
    mode = "error",
    borderRadius = 2,
    dense = false,
    infoSettings = null,
  } = props;

  const [show, setShow] = useState<boolean>(true);

  const closeButtonOnClick = () => {
    setShow(false);
  };

  return mode !== "info" ? (
    <StyledPaper
      mode={mode}
      dense={dense}
      variant="outlined"
      borderRadius={borderRadius}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <HeroIconContainer
          width={21}
          color={
            mode === "error" ? "inherit" : mode === "success" ? "green" : "grey"
          }
          sx={{
            minWidth: "21px",
          }}
        >
          {mode === "error" ? <XCircleIcon /> : <InformationCircleIcon />}
        </HeroIconContainer>
        <Typography
          variant="body2"
          color={mode === "error" ? "error.main" : "inherit"}
        >
          {message ? message : ""}
        </Typography>
      </Stack>
    </StyledPaper>
  ) : infoSettings && show ? (
    <StyledInfoPaper
      dense={dense}
      variant="outlined"
      borderRadius={borderRadius}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        {infoSettings.customIcon ? (
          infoSettings.customIcon
        ) : (
          <HeroIconContainer
            width={21}
            color={"inherit"}
            sx={{
              minWidth: "21px",
            }}
          >
            <InformationCircleIcon />
          </HeroIconContainer>
        )}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="body2" component="span">
                {message ? message : ""}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" component="span">
                {infoSettings.subMessage ? infoSettings.subMessage : ""}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box>
          <IconButton onClick={closeButtonOnClick} size="small">
            <HeroIconContainer width={20} color={"inherit"}>
              <XMarkIcon />
            </HeroIconContainer>
          </IconButton>
        </Box>
      </Stack>
    </StyledInfoPaper>
  ) : null;
}

export type flashBannerModeType = "error" | "normal" | "info" | "success";

interface flashBannerPropsInterface {
  message: React.ReactNode;
  mode?: flashBannerModeType;
  borderRadius?: number;
  dense?: boolean;
  infoSettings?: {
    subMessage: React.ReactNode;
    customIcon?: React.ReactNode;
  };
}

interface StyledPaperProps extends PaperProps {
  mode?: flashBannerModeType;
  borderRadius?: number;
  dense?: boolean;
}

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== "mode" && prop !== "borderRadius" && prop !== "dense",
})<StyledPaperProps>(
  ({ theme, mode = "error", borderRadius = 2, dense = false }) => ({
    borderColor:
      mode === "error"
        ? theme.palette.error.main
        : mode === "success"
        ? theme.palette.success.main
        : theme.customPalette.grey.light_grey,
    backgroundColor:
      mode === "error"
        ? theme.palette.error.light
        : mode === "success"
        ? theme.palette.success.light
        : "transparent",
    padding: dense
      ? `${theme.spacing(1.35)} ${theme.spacing(1.5)}`
      : `${theme.spacing(2)} ${theme.spacing(2)}`,
    borderRadius: borderRadius,
    color:
      mode === "error"
        ? theme.palette.error.main
        : mode === "success"
        ? theme.palette.success.main
        : "inherit",
  })
);

interface StyledInfoPaperProps extends PaperProps {
  borderRadius?: number;
  dense?: boolean;
}

const StyledInfoPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "borderRadius" && prop !== "dense",
})<StyledInfoPaperProps>(({ theme, borderRadius = 2, dense = false }) => ({
  padding: dense
    ? `${theme.spacing(1.35)} ${theme.spacing(1.5)}`
    : `${theme.spacing(2)} ${theme.spacing(2)}`,
  borderRadius: borderRadius,
}));
