import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";

const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.customPalette.grey.light_grey,
}));

export default CustomSkeleton;
