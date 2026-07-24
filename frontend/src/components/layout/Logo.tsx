import { Box, Skeleton, Typography } from "@mui/material";

import { useVenue } from "../../hooks/useVenue";

function Logo() {
  const { data: venue, isLoading } = useVenue();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          bgcolor: "primary.main",
          flexShrink: 0,
        }}
      />

      {isLoading ? (
        <Skeleton
          variant="text"
          width={150}
          height={32}
        />
      ) : (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            maxWidth: 210,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={venue?.name ?? "Nombre del salón"}
        >
          {venue?.name ?? "Nombre del salón"}
        </Typography>
      )}
    </Box>
  );
}

export default Logo;