import Box, { BoxProps } from "@mui/material/Box";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const GreyLabel = styled(Typography)(({ theme }) => ({
  color: theme.customPalette.grey.dim,
  fontWeight: 700,
}));

interface StyledTabLabelProps extends TypographyProps {
  active?: boolean;
}

export const StyledTabLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "active",
})<StyledTabLabelProps>(({ theme, active = false }) => ({
  fontWeight: "700",
  color: active ? theme.palette.primary.main : "#696969",
}));
StyledTabLabel.defaultProps = {
  variant: "body2",
};

interface BadgeBoxProps extends BoxProps {
  active?: boolean;
}

export const StyledBadgeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<BadgeBoxProps>(({ theme, active = false }) => ({
  backgroundColor: theme.palette.primary.light,
  color: active ? theme.palette.primary.main : theme.customPalette.grey.dim,
  fontWeight: "600",
  fontSize: theme.typography.body2.fontSize,
  padding: `0 ${theme.spacing(0.75)}`,
  borderRadius: "50%",
}));
