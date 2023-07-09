import TextField, { TextFieldProps } from "@mui/material/TextField";
import FormHelperText, {
  FormHelperTextProps,
} from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { FormikErrors } from "formik";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Stack";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

export type MaterialTextInputProps = TextFieldProps & {
  helperText?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  withoutFormControl?: boolean;
  rotation?: "row" | "column";
  autoCompleteMode?: boolean;
};

/**
 * @desc A styled Material UI textfield that is used as the main default textfield.
 * - [Material UI textfield documentation](https://mui.com/material-ui/react-text-field/#main-content)
 * - [Material UI textfield API documentation](https://mui.com/material-ui/api/text-field/)
 */
export default function MaterialTextInput(props: MaterialTextInputProps) {
  const {
    helperText = null,
    withoutFormControl = false,
    rotation = "column",
    autoCompleteMode = false,
    ...other
  } = props;

  const TextfieldComp = useMemo(
    () => (
      <>
        <StyledTextfield
          {...other}
          rotation={rotation}
          InputLabelProps={
            other.select || autoCompleteMode
              ? {
                  shrink: rotation === "row" ? false : true,
                  sx: rotation === "row" ? { transform: "unset" } : null,
                }
              : {}
          }
          autoCompleteMode={autoCompleteMode}
        />
        {helperText !== "" && helperText !== null && (
          <StyledStack direction="row" spacing={0.5} alignItems="center">
            {other.error && (
              <HeroIconContainer>
                <ExclamationCircleIcon />
              </HeroIconContainer>
            )}
            <Box>
              <StyledFormHelperText
                error={other.error}
              >{`${helperText}`}</StyledFormHelperText>
            </Box>
          </StyledStack>
        )}
      </>
    ),
    [helperText, withoutFormControl, other, rotation]
  );

  return withoutFormControl ? (
    <>{TextfieldComp}</>
  ) : (
    <StyledFormControl error={other.error} fullWidth={other.fullWidth}>
      {TextfieldComp}
    </StyledFormControl>
  );
}

type StyledTextfieldProps = TextFieldProps & {
  rotation?: "row" | "column";
  autoCompleteMode?: boolean;
};

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  marginLeft: 0,
  marginRight: 0,
  margin: 0,
  fontSize: "0.65rem",
}));

const StyledTextfield = styled(TextField, {
  shouldForwardProp: (prop) =>
    prop !== "rotation" && prop !== "autoCompleteMode",
})<StyledTextfieldProps>(
  ({
    theme,
    select,
    autoCompleteMode = false,
    InputProps,
    rotation,
    label,
  }) => ({
    minWidth: 150,
    position: "relative",
    flexDirection: rotation,
    flexWrap: rotation === "row" ? "wrap" : "nowrap",
    alignItems: "center",
    "& label": {
      left: rotation === "row" ? "auto" : -12,
      top: rotation === "row" ? "auto" : autoCompleteMode ? "14px" : 8,
      color: theme.palette.text.primary,
      position: rotation === "row" ? "relative" : "absolute",
      marginRight: rotation === "row" ? theme.spacing(1) : 0,
      fontSize: rotation === "row" ? "11px" : theme.typography.body1.fontSize,
    },
    "& .MuiOutlinedInput-root": {
      minWidth: rotation === "row" ? 150 : "auto",
      marginTop:
        label && label !== ""
          ? rotation === "column"
            ? select || autoCompleteMode
              ? "20.5px"
              : 0
            : 0
          : 0,
      backgroundColor: "white",
      padding: select || autoCompleteMode ? "0" : "10px 12px",
      "&.Mui-disabled": {
        backgroundColor: theme.customPalette.grey.platinium,
        overflow: "hidden",
        pointerEvents: "none",
        "& fieldset": {
          pointerEvents: "none",
        },
      },
      "&.Mui-error": {
        backgroundColor: theme.palette.error.light,
      },
      "& fieldset": {
        border: `1px solid ${theme.customPalette.grey.light_grey}`,
        height: "100%",
        top: 0,
        "& legend": {
          display: select || autoCompleteMode ? "none" : "block",
        },
      },
      "&.Mui-focused": {
        "& fieldset": {
          borderWidth: "1px",
        },
      },
      "& .MuiSelect-select": {
        padding: "8px 12px",
        paddingRight: autoCompleteMode ? "32px" : select ? "32px" : "12px",
        ...theme.typography.body2,
        fontSize: 16,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${theme.palette.primary.main}`,
      },
      "& .MuiSvgIcon-root": {
        margin:
          InputProps && (InputProps.startAdornment || InputProps.endAdornment)
            ? `0px ${theme.spacing(1)}`
            : 0,
      },
    },
    "& .MuiAutocomplete-inputRoot": {
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: "26px",
      "& .MuiAutocomplete-clearIndicator": {
        maxWidth: 20,
      },
      "& input.MuiAutocomplete-input": {
        // fontSize: theme.typography.body2.fontSize,
        fontSize: 16,
        padding: "9px 12px",
      },
      "& .MuiAutocomplete-endAdornment": {
        "& button": {
          width: 28,
        },
      },
      "& .MuiGrid-root": {
        padding: `0 ${theme.spacing(0.5)}`,
      },
    },
  })
);

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    marginRight: 0,
    margin: 0,
    fontSize: "0.65rem",
  },
}));

const HeroIconContainer = styled(Box)(({ theme }) => ({
  width: 14,
  display: "flex",
  alignItems: "center",
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.error.main,
}));
