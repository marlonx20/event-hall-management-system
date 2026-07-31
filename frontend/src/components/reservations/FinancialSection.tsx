import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useVenue } from "../../hooks/useVenue";
import type { ReservationFormData } from "../../types/reservationForm";
import FormSection from "./FormSection";

interface FinancialSectionProps {
  formData: ReservationFormData;
  onChange: <K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K],
  ) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function FinancialSection({
  formData,
  onChange,
}: FinancialSectionProps) {
  const {
    data: venue,
    isLoading,
    isError,
  } = useVenue();

  if (isLoading) {
    return (
      <FormSection title="4. Información financiera">
        <Box
          sx={{
            py: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      </FormSection>
    );
  }

  if (isError || !venue) {
    return (
      <FormSection title="4. Información financiera">
        <Alert severity="error">
          No fue posible cargar los precios configurados.
        </Alert>
      </FormSection>
    );
  }

  const basePrice = Number(venue.base_price);

  const bouncyCastleCost = Number(
    venue.bouncy_castle_cost,
  );

  const suggestedPrice =
    formData.hasBouncyCastle === null
      ? null
      : basePrice +
        (formData.hasBouncyCastle
          ? bouncyCastleCost
          : 0);

  const remainingBalance =
    formData.totalPrice === null
      ? 0
      : Math.max(
          formData.totalPrice -
            formData.depositAmount,
          0,
        );

  const depositIsTooHigh =
    formData.totalPrice !== null &&
    formData.depositAmount >
      formData.totalPrice;

  return (
    <FormSection title="4. Información financiera">
      <Stack spacing={2.5}>
        <TextField
          fullWidth
          type="number"
          label="Precio total"
          value={formData.totalPrice ?? ""}
          disabled={
            formData.hasBouncyCastle === null
          }
          onChange={(event) => {
            const text = event.target.value;

            if (text === "") {
              onChange("totalPrice", null);
              return;
            }

            const value = Number(text);

            onChange(
              "totalPrice",
              Number.isNaN(value) || value < 0
                ? null
                : value,
            );
          }}
          helperText={
            suggestedPrice === null
              ? "Selecciona primero si incluye brincolín."
              : `Precio sugerido: ${formatCurrency(
                  suggestedPrice,
                )}`
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  $
                </InputAdornment>
              ),
            },
            htmlInput: {
              min: 0,
              step: 50,
            },
          }}
        />

        <TextField
          fullWidth
          type="number"
          label="Anticipo inicial"
          value={
            formData.depositAmount === 0
              ? ""
              : formData.depositAmount
          }
          disabled={formData.totalPrice === null}
          error={depositIsTooHigh}
          helperText={
            depositIsTooHigh
              ? "El anticipo no puede superar el precio total."
              : "Monto que el cliente entrega al reservar."
          }
          onChange={(event) => {
            const text = event.target.value;

            if (text === "") {
              onChange("depositAmount", 0);
              return;
            }

            const value = Number(text);

            onChange(
              "depositAmount",
              Number.isNaN(value) || value < 0
                ? 0
                : value,
            );
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  $
                </InputAdornment>
              ),
            },
            htmlInput: {
              min: 0,
              step: 50,
            },
          }}
        />

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Restante
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 22,
              color:
                remainingBalance > 0
                  ? "secondary.main"
                  : "success.main",
            }}
          >
            {formData.totalPrice === null
              ? "—"
              : formatCurrency(
                  remainingBalance,
                )}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          El restante se calcula automáticamente.
        </Typography>
      </Stack>
    </FormSection>
  );
}

export default FinancialSection;