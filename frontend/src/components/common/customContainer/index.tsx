import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "@mui/material/Button";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface HeroIconContainerProps extends BoxProps {
  width?: number;
  height?: number;
  color?: "light_grey" | "dim_grey" | "grey" | "black" | "inherit" | "green";
}

export const HeroIconContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "width" && prop !== "height" && prop !== "color",
})<HeroIconContainerProps>(
  ({ theme, width = null, height = null, color = "grey" }) => ({
    width: width ? width : "auto",
    height: height ? height : "auto",
    display: "flex",
    alignItems: "center",
    color:
      color === "grey"
        ? theme.customPalette.grey.dim
        : color === "light_grey"
        ? theme.customPalette.grey.light_grey
        : color === "black"
        ? theme.customPalette.grey.base
        : color === "dim_grey"
        ? theme.customPalette.grey.dim
        : color === "green"
        ? theme.palette.success.main
        : "inherit",
    "& svg": {
      width: "100%",
    },
  })
);

interface ProgressWithLabel {
  label?: string;
  loaderSize?: number;
  showSuccessIcon?: boolean;
  showErrorIcon?: boolean;
}

type progressStatusType = "success" | "error" | "normal";

export function ProgressWithLabel(props: ProgressWithLabel) {
  const {
    label = null,
    loaderSize = 16,
    showSuccessIcon = false,
    showErrorIcon = false,
  } = props;

  const progressStatus: progressStatusType =
    !showSuccessIcon && !showErrorIcon
      ? "normal"
      : showSuccessIcon
      ? "success"
      : "error";

  const loaderMode = !showSuccessIcon && !showErrorIcon;

  return (
    <ProgressWithLabelContainer progressStatus={progressStatus}>
      <Stack direction="row" spacing={loaderMode ? 1 : 0.5} alignItems="center">
        <Box sx={{ display: "flex" }}>
          {loaderMode ? (
            <CircularProgress size={loaderSize} />
          ) : (
            <HeroIconContainer width={loaderSize} color="inherit">
              {showErrorIcon ? <XCircleIcon /> : <CheckCircleIcon />}
            </HeroIconContainer>
          )}
        </Box>
        {label && (
          <Box>
            <Typography variant="caption">{label}</Typography>
          </Box>
        )}
      </Stack>
    </ProgressWithLabelContainer>
  );
}

interface ProgressWithLabelContainer extends BoxProps {
  progressStatus?: progressStatusType;
}

const ProgressWithLabelContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "progressStatus",
})<ProgressWithLabelContainer>(({ theme, progressStatus = "normal" }) => ({
  color:
    progressStatus === "normal"
      ? "inherit"
      : progressStatus === "success"
      ? theme.palette.success.main
      : theme.palette.error.main,
}));

interface StyledContactBoxProps extends BoxProps {
  active?: boolean;
}

export const StyledContactBox = styled("a", {
  shouldForwardProp: (prop) => prop !== "active",
})<StyledContactBoxProps>(({ theme, active = true }) => ({
  color: active ? "inherit" : theme.customPalette.grey.light_grey,
  backgroundColor: active ? theme.customPalette.grey.platinium : "transparent",
  borderRadius: 16,
  overflow: "hidden",
  textDecoration: "none",
  maxHeight: "none",
  padding: `2px ${theme.spacing(1)}`,
  display: "flex",
}));

interface ShowMoreButtonProps extends ButtonProps {
  showMoreColor?: boolean;
}

export const ShowMoreButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "showMoreColor",
})<ShowMoreButtonProps>(({ theme, showMoreColor = true }) => ({
  color: showMoreColor ? "#F66700" : theme.palette.primary.main,
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  minWidth: "auto",
  display: "inline-block",
}));

ShowMoreButton.defaultProps = {
  disableRipple: true,
};

interface StyledBadgeProps extends BadgeProps {
  recAvatarSize?: number;
}

export const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== "recAvatarSize",
})<StyledBadgeProps>(({ theme, recAvatarSize }) => ({
  "& .MuiBadge-badge": {
    width: recAvatarSize,
    height: recAvatarSize,
  },
  position: "relative",
}));

export const OpenToWorkContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  zIndex: 2,
  top: 0,
}));

export const DiversifyContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  zIndex: 2,
  top: 0,
  right: 0,
}));
