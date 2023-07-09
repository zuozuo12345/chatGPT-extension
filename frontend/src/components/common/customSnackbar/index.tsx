import React from "react";
import {
  SnackbarContent,
  SnackbarKey,
  SnackbarMessage,
  VariantType,
} from "notistack";
import Paper, { PaperProps } from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";

interface snackbarProps {
  id: SnackbarKey;
  message: SnackbarMessage;
  variant?: VariantType;
}

export const CustomSnackbar = React.forwardRef<HTMLDivElement, snackbarProps>(
  (props, ref) => {
    const { id, message, variant, ...other } = props;

    return (
      <SnackbarContent ref={ref} role="alert" {...other}>
        <StyledSnackbarPaper variantType={variant}>
          <Stack direction="row" spacing={1} alignItems="center">
            {variant === "success" && <CheckCircleIcon style={{ width: 24 }} />}
            {variant === "error" && <XCircleIcon style={{ width: 24 }} />}
            <Typography sx={{ fontWeight: "600" }} variant="body1">
              {message}
            </Typography>
          </Stack>
        </StyledSnackbarPaper>
      </SnackbarContent>
    );
  }
);

interface StyledSnackbarPaperProps extends PaperProps {
  variantType?: VariantType;
}

export const StyledSnackbarPaper = styled((props: StyledSnackbarPaperProps) => {
  const { variantType = "default", ...other } = props;

  return (
    <Paper variant="outlined" {...other}>
      {other.children}
    </Paper>
  );
})(({ theme, variantType }) => ({
  width: "100%",
  border: `1px solid ${
    variantType === "success"
      ? theme.palette.success.main
      : variantType === "error"
      ? theme.palette.error.main
      : theme.palette.primary.main
  }`,
  backgroundColor:
    variantType === "success"
      ? theme.palette.success.light
      : variantType === "error"
      ? theme.palette.error.light
      : theme.palette.primary.light,
  color:
    variantType === "success"
      ? theme.palette.success.main
      : variantType === "error"
      ? theme.palette.error.main
      : theme.palette.primary.main,
  fontWeight: "500",
  fontSize: "14px",
  padding: theme.spacing(1.25),
  borderRadius: 8,
}));
