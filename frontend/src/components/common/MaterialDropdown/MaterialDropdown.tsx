import FormControl, { FormControlProps } from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText, { ListItemTextProps } from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";

import MaterialTextInput from "../MaterialTextInput";
import { MaterialTextInputProps } from "../MaterialTextInput/MaterialTextInput";

export default function MaterialDropdown(props: MaterialDropDownProps) {
  const theme = useTheme();

  const {
    formControlProps = {},
    menuItems = [],
    rotation = "column",
    ...others
  } = props;

  const isNative =
    others.SelectProps && others.SelectProps.native
      ? others.SelectProps.native
      : false;

  return (
    <StyledSelectFormControl
      {...formControlProps}
      fullWidth={others.fullWidth ? others.fullWidth : false}
      error={others.error}
      rotation={rotation}
      haveLabel={others.label ? true : false}
    >
      <EnhancedMaterialTextInput
        {...others}
        SelectProps={{
          ...others.SelectProps,
          displayEmpty: true,
          MenuProps: {
            sx: {
              "& .MuiPaper-root": {
                boxShadow: theme.shadows[0],
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.spacing(0.75),
                overflow: "hidden",
                marginTop: theme.spacing(0.5),
              },
              "& .MuiMenuItem-root": {
                ...theme.typography.body1,
                fontSize: "0.95rem",
              },
              "& .MuiListItemText-root span": {
                ...theme.typography.body1,
                fontSize: "0.95rem",
              },
            },
          },
          sx: {
            "& option.native-option:disabled": {
              color: (theme) => theme.customPalette.grey.light_grey,
            },
          },
        }}
        select
        withoutFormControl
        rotation={rotation}
      >
        {menuItems.map((item, index) => {
          return isNative ? (
            <option
              className="native-option"
              key={index}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </option>
          ) : item.value !== "" ? (
            <MenuItem
              key={index}
              value={item.value}
              disabled={item.disabled ?? false}
            >
              {Array.isArray(others.value) && (
                <Checkbox checked={others.value.includes(item.value)} />
              )}
              <StyledListItemText
                primary={item.label}
                // primaryTypographyProps={{
                //   variant: "body2",
                // }}
              />
            </MenuItem>
          ) : (
            <MenuItem key={index} value="">
              <em>
                <StyledListItemText
                  primary={item.label}
                  // primaryTypographyProps={{
                  //   variant: "body2",
                  // }}
                  emMode
                />
              </em>
            </MenuItem>
          );
        })}
      </EnhancedMaterialTextInput>
    </StyledSelectFormControl>
  );
}

export type MaterialDropDownProps = MaterialTextInputProps & {
  formControlProps?: FormControlProps;
  menuItems?: menuItemInterface[];
  rotation?: "row" | "column";
};

interface menuItemInterface {
  label: string;
  value: string;
  disabled?: boolean;
}

interface StyledListItemTextProps extends ListItemTextProps {
  emMode?: boolean;
}

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "emMode",
})<StyledListItemTextProps>(({ theme, emMode = false }) => ({
  color: emMode ? theme.customPalette.grey.light_grey_darker : "inherit",
  marginTop: 0,
  marginBottom: 0,
  fontSize: "12px",
}));

const EnhancedMaterialTextInput = styled(MaterialTextInput)(
  ({ theme, size }) => ({
    "& .MuiSelect-select": {
      padding: 0,
      "& .MuiListItemText-root": {
        display: "flex",
        alignItems: "center",
        "& .MuiListItemText-primary": {
          fontSize: size === "small" ? theme.typography.body2.fontSize : 16,
        },
      },
    },
  })
);

interface StyledSelectFormControlProps extends FormControlProps {
  rotation?: "row" | "column";
  haveLabel?: boolean;
}

const StyledSelectFormControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== "rotation" && prop !== "haveLabel",
})<StyledSelectFormControlProps>(
  ({ theme, rotation = "column", haveLabel = true }) => ({
    marginTop: haveLabel
      ? rotation === "column"
        ? theme.spacing(0.75)
        : 0
      : 0,
  })
);
