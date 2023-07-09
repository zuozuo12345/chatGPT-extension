import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import ScoutLogo from "../../../assets/scout-icon-new.webp";

export default function InitialisingComp() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "450px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          posiiton: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          sx={{ position: "relative" }}
          size={120}
          thickness={2}
        />
        <Box
          sx={{
            width: 90,
            position: "absolute",
            mt: "15px",
            mb: "9px",
          }}
        >
          <img style={{ width: "100%" }} src={ScoutLogo} />
        </Box>
      </Box>
    </Box>
  );
}
