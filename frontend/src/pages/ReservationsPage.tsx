import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCustomers } from "../hooks/useCustomers";
import { useReservations } from "../hooks/useReservations";
import type { Reservation } from "../types/reservation";

interface LocationState {
  successMessage?: string;
  reservationId?: number;
}

function formatCurrency(value: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(
  status: Reservation["status"],
): string {
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
):
  | "success"
  | "error"
  | "warning"
  | "default" {
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

function ReservationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState =
    location.state as LocationState | null;

  const [successMessage, setSuccessMessage] =
    useState(
      locationState?.successMessage ?? "",
    );

  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
  } = useReservations();

  const sortedReservations = [...reservations].sort(
  (firstReservation, secondReservation) => {
    const firstIsInactive =
      firstReservation.status === "cancelled" ||
      firstReservation.status === "finished";

    const secondIsInactive =
      secondReservation.status === "cancelled" ||
      secondReservation.status === "finished";

    if (firstIsInactive !== secondIsInactive) {
      return firstIsInactive ? 1 : -1;
    }

    const firstDate = new Date(
      `${firstReservation.event_date}T00:00:00`,
    ).getTime();

    const secondDate = new Date(
      `${secondReservation.event_date}T00:00:00`,
    ).getTime();

    if (firstIsInactive) {
      return secondDate - firstDate;
    }

    return firstDate - secondDate;
  },
);

  const {
    data: customers = [],
  } = useCustomers();

  useEffect(() => {
    if (!locationState?.successMessage) {
      return;
    }

    window.history.replaceState(
      {},
      document.title,
    );
  }, [locationState]);

  function getCustomerName(
    customerId: number,
  ): string {
    return (
      customers.find(
        (customer) => customer.id === customerId,
      )?.full_name ?? "Cliente no encontrado"
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.75,
            }}
          >
            Reservaciones
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Consulta y administra los eventos registrados.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            navigate("/reservations/new");
          }}
        >
          Nueva reservación
        </Button>
      </Box>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
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
          No fue posible cargar las reservaciones.
        </Alert>
      )}

      {!isError && reservations.length === 0 && (
        <Card>
          <CardContent
            sx={{
              py: 7,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Todavía no hay reservaciones
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 2.5,
              }}
            >
              Registra la primera reservación para comenzar.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                navigate("/reservations/new");
              }}
            >
              Nueva reservación
            </Button>
          </CardContent>
        </Card>
      )}

      {!isError && reservations.length > 0 && (
        <Grid container spacing={3}>
          {sortedReservations.map((reservation) => {
            const remainingBalance = Number(
              reservation.remaining_balance,
            );

            return (
              <Grid
                key={reservation.id}
                size={{
                  xs: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition:
                      "transform 0.15s ease, box-shadow 0.15s ease",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow:
                        "0 8px 24px rgba(0, 0, 0, 0.10)",
                    },
                  }}
                  onClick={() => {
                    navigate(
                      `/reservations/${reservation.id}`,
                    );
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {getCustomerName(
                              reservation.customer_id,
                            )}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            {reservation.event_type ??
                              "Evento sin tipo"}
                          </Typography>
                        </Box>

                        <Chip
                          size="small"
                          label={getStatusLabel(
                            reservation.status,
                          )}
                          color={getStatusColor(
                            reservation.status,
                          )}
                          variant="outlined"
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {formatDate(
                            reservation.event_date,
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          {formatTime(
                            reservation.start_time,
                          )}
                          {reservation.end_time
                            ? ` - ${formatTime(
                                reservation.end_time,
                              )}`
                            : ""}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          pt: 2,
                          borderTop: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            Total
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {formatCurrency(
                              reservation.total_price,
                            )}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            textAlign: "right",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            Faltante
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 800,
                              color:
                                remainingBalance > 0
                                  ? "secondary.main"
                                  : "success.main",
                            }}
                          >
                            {formatCurrency(
                              reservation.remaining_balance,
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        message={successMessage}
        onClose={() => {
          setSuccessMessage("");
        }}
      />
    </Box>
  );
}

export default ReservationsPage;