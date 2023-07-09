import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";

import ErrorBg from "../../../assets/error_page.svg";

interface ErrorRetryCompProps {
  show?: boolean;
  retryCallback?: () => void;
}

export default function ErrorRetry(props: ErrorRetryCompProps) {
  const { show = false, retryCallback = null } = props;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 6,
      }}
    >
      <Box>
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 280,
            }}
          >
            <img style={{ width: "100%" }} src={ErrorBg} />
          </Box>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography variant="body2">
              {"Failed to retrieve profile."}
            </Typography>
            <Button
              sx={{
                textTransform: "none",
                mt: 1,
              }}
              endIcon={<ReplayIcon />}
              onClick={() => {
                if (show) retryCallback();
              }}
              disabled={!show}
            >
              {`Try again`}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
