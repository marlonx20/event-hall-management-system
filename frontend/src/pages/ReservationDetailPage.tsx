import { useState } from "react";

import FinancialSummaryCard from "../components/reservations/FinancialSummaryCard";
import ReservationActionsCard from "../components/reservations/ReservationActionsCard";
import ReservationDialogs from "../components/reservations/ReservationDialogs";
import EventInformationCard from "../components/reservations/EventInformationCard";
import CustomerInformationCard from "../components/reservations/CustomerInformationCard";

import { useVenue } from "../hooks/useVenue";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { useCustomers } from "../hooks/useCustomers";
import { useReservation } from "../hooks/useReservation";
import type { Reservation } from "../types/reservation";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getStatusLabel(status: Reservation["status"]): string {
  switch (status) {
    case "confirmed":
      return "Confirmada";
    case "finished":
      return "Finalizada";
    case "cancelled":
      return "Cancelada";
    default:
      return "Pendiente";
  }
}

function getStatusColor(
  status: Reservation["status"],
): "success" | "error" | "warning" | "default" {
  switch (status) {
    case "confirmed":
      return "success";
    case "finished":
      return "default";
    case "cancelled":
      return "error";
    default:
      return "warning";
  }
}

function ReservationDetailPage() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const numericReservationId = Number(reservationId);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

  const { data: venue } = useVenue();

  const {
    data: reservation,
    isLoading,
    isError,
    refetch,
  } = useReservation(numericReservationId);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { data: customers = [] } = useCustomers();

  if (!reservationId || Number.isNaN(numericReservationId)) {
    return (
      <Alert severity="error">
        El identificador de la reservación no es válido.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !reservation) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              void refetch();
            }}
          >
            Reintentar
          </Button>
        }
      >
        No fue posible cargar la reservación.
      </Alert>
    );
  }

  const customer =
    customers.find((item) => item.id === reservation.customer_id) ?? null;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          aria-label="Regresar"
          onClick={() => {
            navigate("/reservations");
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {customer?.full_name ?? "Detalle de reservación"}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              textTransform: "capitalize",
            }}
          >
            {formatDate(reservation.event_date)}
          </Typography>
        </Box>

        <Chip
          label={getStatusLabel(reservation.status)}
          color={getStatusColor(reservation.status)}
          variant="outlined"
        />

        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          disabled={
            reservation.status === "cancelled" ||
            reservation.status === "finished"
          }
          onClick={() => {
            navigate(`/reservations/${reservation.id}/edit`);
          }}
        >
          Editar
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <EventInformationCard reservation={reservation} />

            <CustomerInformationCard customer={customer} />

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                  }}
                >
                  Información adicional
                </Typography>

                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.75,
                      }}
                    >
                      Requerimientos especiales
                    </Typography>

                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {reservation.special_requirements ||
                        "Sin requerimientos especiales."}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.75,
                      }}
                    >
                      Notas internas
                    </Typography>

                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {reservation.internal_notes || "Sin notas internas."}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <FinancialSummaryCard reservation={reservation} />

            {reservation.status === "cancelled" && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "error.main",
                      mb: 2,
                    }}
                  >
                    Reservación cancelada
                  </Typography>

                  <Stack spacing={1.5}>
                    <DetailRow
                      label="Fecha de cancelación"
                      value={
                        reservation.cancelled_at
                          ? new Intl.DateTimeFormat("es-MX", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(reservation.cancelled_at))
                          : "No disponible"
                      }
                    />

                    <DetailRow
                      label="Motivo"
                      value={
                        reservation.cancellation_reason ===
                        "another_reservation_confirmed"
                          ? "Se confirmó otra reservación para esa fecha"
                          : "Cancelación manual"
                      }
                    />
                  </Stack>
                </CardContent>
              </Card>
            )}
            {reservation.status === "finished" && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "success.main",
                      mb: 2,
                    }}
                  >
                    Evento finalizado
                  </Typography>

                  {reservation.final_comments ? (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mb: 0.5,
                        }}
                      >
                        Comentarios finales
                      </Typography>

                      <Typography
                        sx={{
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {reservation.final_comments}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      El evento fue finalizado sin comentarios adicionales.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
            <ReservationActionsCard
              reservation={reservation}
              onRegisterPayment={() => {
                setPaymentDialogOpen(true);
              }}
              onCancel={() => {
                setCancelDialogOpen(true);
              }}
              onFinish={() => {
                setFinishDialogOpen(true);
              }}
            />
          </Stack>
        </Grid>
      </Grid>
      <ReservationDialogs
        reservation={reservation}
        extraHourPrice={venue ? Number(venue.extra_hour_price) : 0}
        paymentDialogOpen={paymentDialogOpen}
        cancelDialogOpen={cancelDialogOpen}
        finishDialogOpen={finishDialogOpen}
        onClosePaymentDialog={() => {
          setPaymentDialogOpen(false);
        }}
        onCloseCancelDialog={() => {
          setCancelDialogOpen(false);
        }}
        onCloseFinishDialog={() => {
          setFinishDialogOpen(false);
        }}
      />
    </Box>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
  valueColor?: string;
}

function DetailRow({
  label,
  value,
  emphasized = false,
  valueColor,
}: DetailRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: emphasized ? 700 : 400,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: "right",
          fontWeight: emphasized ? 800 : 600,
          color: valueColor ?? "text.primary",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default ReservationDetailPage;
