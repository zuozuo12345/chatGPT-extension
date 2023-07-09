import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tab, { TabProps } from "@mui/material/Tab";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export interface StyledTabsProps extends TabsProps {}
export interface StyledTabProps extends TabProps {
  active?: boolean;
}
export interface StyledTabLabelProps extends TypographyProps {
  active?: boolean;
}
export type recommendationLvlType =
  | "highly_recommended"
  | "recommended"
  | "considered"
  | "not_recommended";

export const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
}));

export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== "active",
})<StyledTabsProps>(({ theme, value }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 32,
  "& button": {
    padding: `0px ${theme.spacing(1)}`,
  },
  "& button.MuiTab-root.Mui-selected": {
    color: theme.palette.primary.main,
    borderColor: theme.palette.divider,
    backgroundColor: "white",
  },
  "& .MuiTypography-root": {
    textTransform: "none",
    color: theme.palette.primary.main,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== "active",
})<StyledTabProps>(({ theme, active = false }) => ({
  minHeight: 32,
}));

export const StyledTabLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "active",
})<StyledTabLabelProps>(({ theme, active = false }) => ({
  fontWeight: "700",
  color: active ? theme.palette.primary.main : "#696969",
}));
StyledTabLabel.defaultProps = {
  variant: "body2",
};

export const StyledGreyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.customPalette.grey.platinium,
  color: theme.customPalette.grey.base,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(214, 214, 214, 0.75)",
  },
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const KeyInsightContainer = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(1.75)} ${theme.spacing(1.5)}`,
}));
