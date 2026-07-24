import { Box, Typography } from "@mui/material";

import type { ReservationStatus } from "../../types/reservation";

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  compact?: boolean;
}

interface StatusConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
}

function getStatusConfig(
  status: ReservationStatus,
): StatusConfig {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmada",
        backgroundColor: "success.main",
        textColor: "common.white",
      };

    case "pending":
      return {
        label: "Pendiente",
        backgroundColor: "warning.main",
        textColor: "common.white",
      };

    case "finished":
      return {
        label: "Finalizada",
        backgroundColor: "grey.300",
        textColor: "text.primary",
      };

    case "cancelled":
      return {
        label: "Cancelada",
        backgroundColor: "error.main",
        textColor: "common.white",
      };
  }
}

function ReservationStatusBadge({
  status,
  compact = false,
}: ReservationStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: compact ? 86 : 105,
        px: compact ? 1.25 : 1.75,
        py: compact ? 0.5 : 0.75,
        borderRadius: 1.5,
        bgcolor: config.backgroundColor,
        color: config.textColor,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
}

export default ReservationStatusBadge;