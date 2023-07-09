import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";

export const CustomMenu = styled(Menu)(({ theme }) => ({
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
}));
