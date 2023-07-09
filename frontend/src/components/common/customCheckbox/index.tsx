import Checkbox from "@mui/material/Checkbox";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 4,
  width: 16,
  height: 16,
  margin: "2px",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "white",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.customPalette.grey.light_grey_darker,
}));
StyledCheckbox.defaultProps = {
  icon: <BpIcon />,
};

interface StyledFormControlLabelProps extends FormControlLabelProps {
  alternateFontSize?: boolean;
  boldLabel?: boolean;
}

export const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) =>
    prop !== "alternateFontSize" && prop !== "boldLabel",
})<StyledFormControlLabelProps>(
  ({ theme, alternateFontSize = false, boldLabel = false }) => ({
    "& .MuiFormControlLabel-label": {
      fontSize: alternateFontSize
        ? theme.typography.body1.fontSize
        : theme.typography.body2.fontSize,
      fontWeight: boldLabel ? "bold" : "normal",
    },
  })
);
