import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";

interface RequestContactBtnProps extends ButtonBaseProps {
  inactive?: boolean;
  greyBgOnly?: boolean;
  mode?: "request" | "reveal" | "engage";
}

const RequestContactBtn = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    prop !== "inactive" && prop !== "mode" && prop !== "greyBgOnly",
})<RequestContactBtnProps>(
  ({
    theme,
    inactive = false,
    disabled,
    mode = "engage",
    greyBgOnly = true,
  }) => ({
    position: "relative",
    width: "100%",
    maxWidth: 200,
    color:
      mode === "reveal" && !disabled && !inactive
        ? theme.palette.success.main
        : !disabled && !inactive
        ? theme.palette.primary.main
        : theme.customPalette.grey.dim,
    backgroundColor:
      mode === "reveal" && !disabled && !inactive
        ? theme.palette.success.light
        : !disabled && !inactive
        ? theme.palette.primary.light
        : theme.customPalette.grey.light_grey,
    border:
      mode === "reveal" && !disabled && !inactive
        ? `1px solid ${theme.palette.success.main}`
        : !disabled && !inactive
        ? `1px solid ${theme.palette.primary.main}`
        : `1px solid ${theme.customPalette.grey.light_grey}`,
    borderRadius: theme.spacing(1),
    fontWeight: !disabled && !inactive ? "bold" : "normal",
    justifyContent: "flex-start",
    padding: `${theme.spacing(0.5)} ${theme.spacing(0.75)}`,
    fontSize: theme.typography.caption.fontSize,
  })
);

export { RequestContactBtn };
