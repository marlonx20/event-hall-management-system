import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useReservationPayments } from "../../hooks/useReservationPayments";
import type {
  Payment,
  PaymentConcept,
  PaymentMethod,
} from "../../types/payment";

interface PaymentHistoryProps {
  reservationId: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getConceptLabel(
  concept: PaymentConcept,
): string {
  switch (concept) {
    case "deposit":
      return "Anticipo";

    case "final_payment":
      return "Liquidación";

    case "extra_hours":
      return "Horas extra";

    case "damages":
      return "Desperfectos";

    default:
      return concept;
  }
}

function getConceptColor(
  concept: PaymentConcept,
):
  | "success"
  | "info"
  | "warning"
  | "error"
  | "default" {
  switch (concept) {
    case "deposit":
      return "success";

    case "final_payment":
      return "info";

    case "extra_hours":
      return "warning";

    case "damages":
      return "error";

    default:
      return "default";
  }
}

function getMethodLabel(
  method: PaymentMethod,
): string {
  switch (method) {
    case "cash":
      return "Efectivo";

    case "transfer":
      return "Transferencia";

    default:
      return method;
  }
}

function PaymentHistory({
  reservationId,
}: PaymentHistoryProps) {
  const {
    data: payments = [],
    isLoading,
    isError,
  } = useReservationPayments(reservationId);

  if (isLoading) {
    return (
      <Box
        sx={{
          py: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={26} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        No fue posible cargar el historial de pagos.
      </Alert>
    );
  }

  if (payments.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
        }}
      >
        Todavía no hay pagos registrados.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {payments.map(
        (
          payment: Payment,
          index: number,
        ) => (
          <Box key={payment.id}>
            <Stack spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(payment.amount)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {formatDate(payment.payment_date)}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={getConceptLabel(
                    payment.concept,
                  )}
                  color={getConceptColor(
                    payment.concept,
                  )}
                  variant="outlined"
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Método:{" "}
                {getMethodLabel(payment.method)}
              </Typography>

              {payment.reference && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    overflowWrap: "anywhere",
                  }}
                >
                  Referencia: {payment.reference}
                </Typography>
              )}
            </Stack>

            {index < payments.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ),
      )}
    </Stack>
  );
}

export default PaymentHistory;