import { useState, useCallback, useMemo } from "react";
import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CustomMenu } from "../customDropdowns";

/**
 * @desc A styled Material UI button that is used as the main default button.
 * - [Material UI button documentation](https://mui.com/material-ui/react-button/#main-content)
 * - [Material UI button API documentation](https://mui.com/material-ui/api/button/)
 */
export default function MainButton(props: MainButtonProps) {
  const {
    menu,
    loading = false,
    onClick,
    borderRadius = 24,
    ...others
  } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const haveMenu =
    menu !== null &&
    menu !== undefined &&
    typeof menu.items === "object" &&
    menu.items.length > 0;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (haveMenu) {
        setAnchorEl(event.currentTarget);
      }
    },
    [haveMenu]
  );

  const handleClose = () => {
    if (anchorEl !== null) {
      setAnchorEl(null);
    }
  };

  const menuOnClick = (value: valueType) => {
    if (haveMenu && menu.callbackFunc !== undefined) {
      menu.callbackFunc(value);
    }

    handleClose();
  };

  const StyledButtonComp = useMemo(() => {
    return (
      <StyledButton
        size="small"
        variant="contained"
        disableElevation
        borderRadius={borderRadius}
        {...others}
        endIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : haveMenu ? (
            <Box
              sx={{
                width: 16,
                display: "flex",
              }}
            >
              {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Box>
          ) : (
            others.endIcon
          )
        }
        onClick={haveMenu ? handleClick : onClick}
      >
        {others === undefined ? "" : others.children}
      </StyledButton>
    );
  }, [
    borderRadius,
    others,
    loading,
    haveMenu,
    handleClick,
    onClick,
    others.children,
  ]);

  return (
    <>
      {StyledButtonComp}
      {haveMenu && (
        <CustomMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {menu.items.map((menuItem, index) => (
            <MenuItem key={index} onClick={() => menuOnClick(menuItem.value)}>
              {menuItem.title}
            </MenuItem>
          ))}
        </CustomMenu>
      )}
    </>
  );
}

interface MainButtonProps extends ButtonProps {
  target?: string;
  rel?: string;
  loading?: boolean;
  menu?: {
    callbackFunc?: (value: valueType) => void;
    items: menuItemInterface[];
  };
  borderRadius?: number;
}

interface menuItemInterface {
  title: string;
  value: valueType;
}

type valueType = string | number | boolean;

interface StyledButtonProps extends ButtonProps {
  borderRadius?: number;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "borderRadius",
})<StyledButtonProps>(({ theme, borderRadius = 24, variant }) => ({
  borderRadius: variant === "text" ? 4 : borderRadius,
  textTransform: "none",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  fontWeight: variant === "text" ? "700" : "500",
}));
