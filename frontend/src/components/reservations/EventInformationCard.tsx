import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import type { Reservation } from "../../types/reservation";

interface EventInformationCardProps {
  reservation: Reservation;
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":");

  const date = new Date();
  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0,
  );

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function EventInformationCard({
  reservation,
}: EventInformationCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2.5,
          }}
        >
          Información del evento
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <EventDetail
              label="Tipo de evento"
              value={
                reservation.event_type ??
                "No especificado"
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <EventDetail
              label="Horario"
              value={`${formatTime(
                reservation.start_time,
              )}${
                reservation.end_time
                  ? ` - ${formatTime(
                      reservation.end_time,
                    )}`
                  : ""
              }`}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <EventDetail
              label="Personas"
              value={
                reservation.guest_count === null
                  ? "No especificado"
                  : String(
                      reservation.guest_count,
                    )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <EventDetail
              label="Brincolín"
              value={
                reservation.has_bouncy_castle
                  ? "Sí"
                  : "No"
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

interface EventDetailProps {
  label: string;
  value: string;
}

function EventDetail({
  label,
  value,
}: EventDetailProps) {
  return (
    <>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </>
  );
}

export default EventInformationCard;