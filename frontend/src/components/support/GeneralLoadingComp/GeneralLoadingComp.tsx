import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import CustomSkeleton from "../CustomSkeleton/CustomSkeleton";

export default function GeneralLoadingComp() {
  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <CustomSkeleton variant="circular" width={58} height={58} />
          </Box>
        </Box>
        <Box>
          <Stack spacing={0.75}>
            <CustomSkeleton variant="rounded" width={160} height={26} />
            <CustomSkeleton variant="rounded" width={160} height={24} />
            <CustomSkeleton variant="rounded" width={229} height={14} />
          </Stack>
        </Box>
      </Stack>
      <Stack
        sx={{
          mt: 3,
        }}
        spacing={2}
      >
        <CustomSkeleton variant="rounded" width={"100%"} height={26} />
        <CustomSkeleton variant="rounded" width={"100%"} height={26} />
        <CustomSkeleton variant="rounded" width={"100%"} height={26} />
        <CustomSkeleton variant="rounded" width={"100%"} height={26} />
        <CustomSkeleton variant="rounded" width={"100%"} height={26} />
      </Stack>
    </Box>
  );
}
