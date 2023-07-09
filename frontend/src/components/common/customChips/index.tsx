import Chip, { ChipProps } from "@mui/material/Chip";
import { TypographyProps } from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { styled } from "@mui/material/styles";

interface StyledYellowChipProps extends ChipProps {
  border?: boolean;
  yellowText?: boolean;
  typographyVariant?: TypographyProps["variant"];
  borderRadius?: number;
}

export const StyledYellowChip = styled(Chip, {
  shouldForwardProp: (prop) =>
    prop !== "border" &&
    prop !== "yellowText" &&
    prop !== "typographyVariant" &&
    prop !== "borderRadius",
})<StyledYellowChipProps>(
  ({
    theme,
    border = false,
    yellowText = false,
    typographyVariant = "inherit",
    borderRadius = 16,
  }) => ({
    backgroundColor: theme.palette.warning.light,
    color: yellowText ? theme.palette.warning.main : "black",
    border: border ? `1px solid ${theme.palette.warning.main}` : "none",
    borderRadius: borderRadius,
    fontWeight: "500",
    fontSize:
      typographyVariant === "inherit"
        ? theme.typography.body2.fontSize
        : theme.typography.caption.fontSize,
  })
);

interface StyledAltGreenChipProps extends ChipProps {
  border?: boolean;
  yellowText?: boolean;
  typographyVariant?: TypographyProps["variant"];
  borderRadius?: number;
}

export const StyledAltGreenChip = styled(Chip, {
  shouldForwardProp: (prop) =>
    prop !== "border" &&
    prop !== "yellowText" &&
    prop !== "typographyVariant" &&
    prop !== "borderRadius",
})<StyledAltGreenChipProps>(
  ({
    theme,
    border = false,
    yellowText = false,
    typographyVariant = "inherit",
    borderRadius = 16,
  }) => ({
    backgroundColor: theme.palette.success.light,
    color: yellowText ? theme.palette.success.main : "black",
    border: border ? `1px solid ${theme.palette.success.main}` : "none",
    borderRadius: borderRadius,
    fontWeight: "500",
    fontSize:
      typographyVariant === "inherit"
        ? theme.typography.body2.fontSize
        : theme.typography.caption.fontSize,
  })
);

interface StyledSkillChipProps extends ChipProps {
  haveSkill?: boolean;
  greyOutLabelTxt?: boolean;
  labelBold?: boolean;
  noBorder?: boolean;
}

export const StyledSkillChip = styled((props: StyledSkillChipProps) => {
  const {
    haveSkill,
    greyOutLabelTxt,
    labelBold,
    noBorder = false,
    ...other
  } = props;

  return (
    <Chip
      variant="outlined"
      size="small"
      icon={haveSkill ? <StyledCheckCircle /> : <StyledAddCircle />}
      {...other}
    >
      {other.children}
    </Chip>
  );
})(
  ({
    theme,
    haveSkill,
    greyOutLabelTxt = false,
    labelBold = true,
    noBorder = false,
  }) => ({
    border: noBorder
      ? "none"
      : haveSkill
      ? `1px solid ${theme.palette.success.main}`
      : `1px solid ${theme.palette.warning.main}`,
    backgroundColor: haveSkill
      ? theme.palette.success.light
      : theme.palette.warning.light,
    color: greyOutLabelTxt
      ? theme.customPalette.grey.base
      : haveSkill
      ? theme.palette.success.main
      : theme.palette.warning.main,
    fontWeight: labelBold ? "600" : "500",
    padding: `1px`,
    "& .MuiChip-icon": {
      color: haveSkill
        ? theme.palette.success.main
        : theme.palette.warning.main,
    },
    "& .MuiChip-label": {
      color: greyOutLabelTxt
        ? theme.customPalette.grey.base
        : haveSkill
        ? theme.palette.success.main
        : theme.customPalette.grey.base,
      whiteSpace: "break-spaces",
    },
    height: "auto",
  })
);

const StyledCheckCircle = styled(CheckCircleIcon)(({ theme }) => ({
  "&.MuiChip-icon": {
    fontSize: "1.05rem",
    color: theme.palette.success.main,
  },
}));

const StyledAddCircle = styled(AddCircleIcon)(({ theme }) => ({
  "&.MuiChip-icon": {
    fontSize: "1.05rem",
    color: theme.palette.warning.main,
  },
}));

export const StyledGreyBorderChip = styled(Chip)(({ theme }) => ({
  border: `1px solid ${theme.customPalette.grey.light_grey}`,
  backgroundColor: "transparent",
  height: "auto",
  padding: `1px`,
  "& .MuiChip-label": {
    whiteSpace: "break-spaces",
  },
}));
StyledGreyBorderChip.defaultProps = {
  size: "small",
};
