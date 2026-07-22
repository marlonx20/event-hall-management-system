import {
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type { Customer } from "../../types/customer";
import type { ReservationFormData } from "../../types/reservationForm";
import FormSection from "./FormSection";

interface ReservationSummaryProps {
  formData: ReservationFormData;
  selectedCustomer: Customer | null;
  totalPrice: number | null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function ReservationSummary({
  formData,
  selectedCustomer,
  totalPrice,
}: ReservationSummaryProps) {
  const remainingBalance =
    totalPrice === null
      ? null
      : Math.max(totalPrice - formData.depositAmount, 0);

  return (
    <FormSection title="Resumen de la reservación">
      <Stack spacing={1.5}>
        <SummaryRow
          label="Cliente"
          value={selectedCustomer?.full_name ?? "—"}
        />

        <SummaryRow
          label="Fecha del evento"
          value={
            formData.eventDate
              ? formData.eventDate.format("DD/MM/YYYY")
              : "—"
          }
        />

        <SummaryRow
          label="Horario"
          value={
            formData.startTime && formData.endTime
              ? `${formData.startTime.format(
                  "hh:mm A",
                )} - ${formData.endTime.format("hh:mm A")}`
              : "—"
          }
        />

        <SummaryRow
          label="Tipo de evento"
          value={formData.eventType || "—"}
        />

        <SummaryRow
          label="Personas"
          value={
            formData.guestCount === null
              ? "No especificado"
              : String(formData.guestCount)
          }
        />

        <SummaryRow
          label="Brincolín"
          value={
            formData.hasBouncyCastle === null
              ? "—"
              : formData.hasBouncyCastle
                ? "Sí"
                : "No"
          }
        />

        <Divider />

        <SummaryRow
          label="Precio total"
          value={
            totalPrice === null
              ? "—"
              : formatCurrency(totalPrice)
          }
          emphasized
        />

        <SummaryRow
          label="Anticipo"
          value={formatCurrency(formData.depositAmount)}
        />

        <SummaryRow
          label="Restante"
          value={
            remainingBalance === null
              ? "—"
              : formatCurrency(remainingBalance)
          }
          emphasized
          valueColor={
            remainingBalance !== null && remainingBalance > 0
              ? "secondary.main"
              : "success.main"
          }
        />
      </Stack>
    </FormSection>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
  valueColor?: string;
}

function SummaryRow({
  label,
  value,
  emphasized = false,
  valueColor,
}: SummaryRowProps) {
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

export default ReservationSummary;