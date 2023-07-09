import FormHelperText from "@mui/material/FormHelperText";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { FormikErrors } from "formik";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Stack";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type TextInputProps = InputBaseProps & {
  label?: string;
  formControlProps?: FormControlProps;
  helperText?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  accept?: string;
};

/**
 * @desc A styled Material UI OutlinedInput textfield that is used as the alternate textfield.
 * - [Material UI textfield documentation](https://mui.com/material-ui/react-text-field/#main-content)
 * - [Material UI OutlinedInput API documentation](https://mui.com/material-ui/api/outlined-input/#main-content)
 */
export default function TextInput(props: TextInputProps) {
  const {
    formControlProps = {},
    label = null,
    helperText = null,
    error,
    ...other
  } = props;

  return (
    <StyledFormControl
      fullWidth={other.fullWidth ? other.fullWidth : true}
      error={error}
      variant="outlined"
      {...formControlProps}
    >
      {label !== "" && label !== null && (
        <StyledTextInputLabel shrink>{props.label}</StyledTextInputLabel>
      )}
      <StyledInput fullWidth {...other} />
      {helperText !== "" && helperText !== null && (
        <StyledStack direction="row" spacing={0.5} alignItems="center">
          {error && (
            <HeroIconContainer>
              <ExclamationCircleIcon />
            </HeroIconContainer>
          )}
          <Box>
            <FormHelperText>{`${helperText}`}</FormHelperText>
          </Box>
        </StyledStack>
      )}
    </StyledFormControl>
  );
}

const StyledFormControl = styled(FormControl)(({ theme, error }) => ({
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    marginRight: 0,
    margin: 0,
    fontSize: "0.65rem",
  },
}));

const StyledInput = styled(InputBase)(
  ({ theme, fullWidth, endAdornment, value }) => ({
    "label + &": {
      marginTop: theme.spacing(3.25),
    },
    "&.MuiInputBase-root": {
      width: fullWidth ? "100%" : "auto",
      borderRadius: 4,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "white",
      border: `1px solid ${theme.customPalette.grey.light_grey}`,
      fontSize: 16,
      padding: "8px 12px",
      transition: theme.transitions.create([
        "border-color",
        "background-color",
        "box-shadow",
      ]),
      "& svg": {
        color: value
          ? theme.customPalette.grey.dim
          : theme.customPalette.grey.light_grey,
      },
      "&.Mui-focused": {
        borderColor: theme.palette.primary.main,

        "& svg": {
          color: theme.customPalette.grey.dim,
        },
      },
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-error": {
        borderColor: theme.palette.error.main,
        backgroundColor: theme.palette.error.light,

        "& svg": {
          color: theme.customPalette.grey.dim,
        },
      },
      "&.Mui-disabled": {
        pointerEvents: "none",
        border: `1px solid transparent`,
        backgroundColor: theme.customPalette.grey.platinium,
      },
      "& input::placeholder": {
        fontSize: theme.typography.body2.fontSize,
      },
      "& .MuiInputAdornment-root": {
        "&:nth-of-type(2)": {
          paddingLeft: endAdornment ? theme.spacing(1) : 0,
        },
        "& p": {
          fontSize: "0.85rem",
          color: theme.customPalette.grey.dim,
        },
      },
    },
    "& .MuiInputBase-input": {
      border: 0,
      padding: 0,
      "&::-webkit-file-upload-button": {
        display: "none",
      },
      "&::file-selector-button": {
        display: "none",
      },
    },
  })
);

export const StyledTextInputLabel = styled(InputLabel)(({ theme }) => ({
  left: "-12px",
  top: theme.spacing(1.75),
  color: theme.customPalette.grey.base,
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
