import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import type { ReservationFormData } from "../../types/reservationForm";
import FormSection from "./FormSection";

interface PaymentSectionProps {
  formData: ReservationFormData;
  onChange: <K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K],
  ) => void;
}

function PaymentSection({
  formData,
  onChange,
}: PaymentSectionProps) {
  const hasDeposit = formData.depositAmount > 0;

  return (
    <FormSection title="5. Registro de pago inicial">
      <Stack spacing={2.5}>
        {!hasDeposit && (
          <Alert severity="info">
            No se registrará un pago inicial porque el anticipo es $0.
          </Alert>
        )}

        <FormControl
          fullWidth
          size="small"
          required={hasDeposit}
          disabled={!hasDeposit}
        >
          <InputLabel>Método de pago</InputLabel>

          <Select
            label="Método de pago"
            value={formData.paymentMethod}
            onChange={(event) => {
              onChange(
                "paymentMethod",
                event.target.value as ReservationFormData["paymentMethod"],
              );
            }}
          >
            <MenuItem value="">
              <em>Seleccionar...</em>
            </MenuItem>

            <MenuItem value="cash">
              Efectivo
            </MenuItem>

            <MenuItem value="transfer">
              Transferencia
            </MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="Fecha del pago"
          value={formData.paymentDate}
          disabled={!hasDeposit}
          onChange={(value) => {
            onChange("paymentDate", value);
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              required: hasDeposit,
            },
          }}
        />

        <TextField
          fullWidth
          label="Referencia / comprobante"
          value={formData.paymentReference}
          disabled={!hasDeposit}
          onChange={(event) => {
            onChange(
              "paymentReference",
              event.target.value,
            );
          }}
          placeholder="Ejemplo: folio o número de operación"
        />
      </Stack>
    </FormSection>
  );
}

export default PaymentSection;