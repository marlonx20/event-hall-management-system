import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

interface ScheduleItemProps {
  dateLabel?: string;
  title: string;
  subtitle?: string;
  statusLabel?: string;
}

function ScheduleItem({
  dateLabel,
  title,
  subtitle,
  statusLabel,
}: ScheduleItemProps) {
  return (
    <Box
      sx={{
        py: 1.75,
        borderBottom: "1px solid",
        borderColor: "divider",

        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "flex-start",
        }}
      >
        {dateLabel && (
          <Box
            sx={{
              minWidth: 78,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {dateLabel}
            </Typography>
          </Box>
        )}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {statusLabel && (
          <Chip
          label={statusLabel}
          size="small"
          variant="outlined"
          color={
            statusLabel==="Confirmada"
            ? "success"
            : statusLabel==="Pendiente"
            ? "warning"
            : statusLabel==="Cancelada"
            ? "error"
            : "default"
          }
          />
        )}
      </Stack>
    </Box>
  );
}

export default ScheduleItem;