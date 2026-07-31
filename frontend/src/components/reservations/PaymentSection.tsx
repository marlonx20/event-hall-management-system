import {
  Alert,
  FormControl,
  Button,
  Box,
  Typography,
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

function PaymentSection({ formData, onChange }: PaymentSectionProps) {
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
              const paymentMethod = event.target
                .value as ReservationFormData["paymentMethod"];

              onChange("paymentMethod", paymentMethod);

              if (paymentMethod !== "transfer") {
                onChange("paymentReceiptFile", null);
              }
            }}
          >
            <MenuItem value="">
              <em>Seleccionar...</em>
            </MenuItem>

            <MenuItem value="cash">Efectivo</MenuItem>

            <MenuItem value="transfer">Transferencia</MenuItem>
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
            onChange("paymentReference", event.target.value);
          }}
          placeholder="Ejemplo: folio o número de operación"
        />
        {formData.paymentMethod === "transfer" && (
          <Box>
            <Button
              component="label"
              variant="outlined"
              disabled={!hasDeposit}
              fullWidth
            >
              {formData.paymentReceiptFile
                ? "Cambiar fotografía"
                : "Agregar fotografía del comprobante"}

              <input
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  onChange("paymentReceiptFile", file);

                  event.target.value = "";
                }}
              />
            </Button>

            {formData.paymentReceiptFile && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formData.paymentReceiptFile.name}
                </Typography>

                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    onChange("paymentReceiptFile", null);
                  }}
                >
                  Quitar
                </Button>
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </FormSection>
  );
}

export default PaymentSection;
