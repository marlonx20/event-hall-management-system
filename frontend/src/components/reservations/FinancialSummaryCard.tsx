import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type { Reservation } from "../../types/reservation";
import PaymentHistory from "./PaymentHistory";

interface FinancialSummaryCardProps {
  reservation: Reservation;
}

function formatCurrency(value: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function FinancialSummaryCard({
  reservation,
}: FinancialSummaryCardProps) {
  const extraCharge = Number(
    reservation.extra_charge ?? 0,
  );

  const damageCharge = Number(
    reservation.damage_charge ?? 0,
  );

  const hasAdditionalCharges =
    extraCharge > 0 || damageCharge > 0;

  const totalWithCharges =
    Number(reservation.total_price) +
    extraCharge +
    damageCharge;

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
          Resumen financiero
        </Typography>

        <Stack spacing={1.5}>
          <FinancialRow
            label="Precio total"
            value={formatCurrency(
              reservation.total_price,
            )}
            emphasized
          />

          {extraCharge > 0 && (
            <FinancialRow
              label={`Horas extra (${Number(
                reservation.extra_hours ?? 0,
              )})`}
              value={formatCurrency(
                reservation.extra_charge ?? "0",
              )}
            />
          )}

          {damageCharge > 0 && (
            <FinancialRow
              label="Desperfectos"
              value={formatCurrency(
                reservation.damage_charge ?? "0",
              )}
            />
          )}

          {hasAdditionalCharges && (
            <FinancialRow
              label="Total con cargos"
              value={formatCurrency(
                String(totalWithCharges),
              )}
              emphasized
            />
          )}

          <FinancialRow
            label="Pagado"
            value={formatCurrency(
              reservation.amount_paid,
            )}
          />

          <Divider />

          <FinancialRow
            label="Faltante"
            value={formatCurrency(
              reservation.remaining_balance,
            )}
            emphasized
            valueColor={
              Number(
                reservation.remaining_balance,
              ) > 0
                ? "secondary.main"
                : "success.main"
            }
          />
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Historial de pagos
        </Typography>

        <PaymentHistory
          reservationId={reservation.id}
        />
      </CardContent>
    </Card>
  );
}

interface FinancialRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
  valueColor?: string;
}

function FinancialRow({
  label,
  value,
  emphasized = false,
  valueColor,
}: FinancialRowProps) {
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

export default FinancialSummaryCard;