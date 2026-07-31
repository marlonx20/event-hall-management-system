import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface FinishReservationDialogProps {
  open: boolean;

  extraHourPrice: number;
  currentRemainingBalance: number;

  currentExtraHours: number;
  currentDamageDescription: string;
  currentDamageCharge: number;

  isSaving: boolean;
  onClose: () => void;

  onSaveCharges: (data: {
    extraHours: number;
    damageDescription: string;
    damageCharge: number;
  }) => void;

  onFinish: (data: {
    finalComments: string;
  }) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function FinishReservationDialog({
  open,
  extraHourPrice,
  currentRemainingBalance,
  currentExtraHours,
  currentDamageDescription,
  currentDamageCharge,
  isSaving,
  onClose,
  onSaveCharges,
  onFinish,
}: FinishReservationDialogProps) {
  const [extraHours, setExtraHours] =
    useState<number | "">("");

  const [damageDescription, setDamageDescription] =
    useState("");

  const [damageCharge, setDamageCharge] =
    useState<number | "">("");

  const [finalComments, setFinalComments] =
    useState("");

  const [validationMessage, setValidationMessage] =
    useState<string | null>(null);

  const balanceIsPaid =
    currentRemainingBalance === 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    setExtraHours(
      currentExtraHours > 0
        ? currentExtraHours
        : "",
    );

    setDamageDescription(
      currentDamageDescription,
    );

    setDamageCharge(
      currentDamageCharge > 0
        ? currentDamageCharge
        : "",
    );

    setFinalComments("");
    setValidationMessage(null);
  }, [
    open,
    currentExtraHours,
    currentDamageDescription,
    currentDamageCharge,
  ]);

  const numericExtraHours =
    extraHours === ""
      ? 0
      : Number(extraHours);

  const numericDamageCharge =
    damageCharge === ""
      ? 0
      : Number(damageCharge);

  const extraHoursCharge =
    numericExtraHours * extraHourPrice;

  const chargesChanged =
    numericExtraHours !== currentExtraHours ||
    numericDamageCharge !== currentDamageCharge ||
    damageDescription.trim() !==
      currentDamageDescription.trim();

  const hasDamageChargeWithoutDescription =
    numericDamageCharge > 0 &&
    damageDescription.trim().length === 0;

  function clearValidationMessage() {
    setValidationMessage(null);
  }

  function handleSaveCharges() {
    if (numericExtraHours < 0) {
      setValidationMessage(
        "Las horas extra no pueden ser negativas.",
      );
      return;
    }

    if (numericDamageCharge < 0) {
      setValidationMessage(
        "El cargo por desperfectos no puede ser negativo.",
      );
      return;
    }

    if (hasDamageChargeWithoutDescription) {
      setValidationMessage(
        "Describe el desperfecto que genera el cobro.",
      );
      return;
    }

    if (!chargesChanged) {
      setValidationMessage(
        "No realizaste cambios en los cargos adicionales.",
      );
      return;
    }

    setValidationMessage(null);

    onSaveCharges({
      extraHours: numericExtraHours,
      damageDescription:
        damageDescription.trim(),
      damageCharge: numericDamageCharge,
    });
  }

  function handleFinish() {
    if (chargesChanged) {
      setValidationMessage(
        "Guarda primero los cambios en los cargos adicionales.",
      );
      return;
    }

    if (!balanceIsPaid) {
      setValidationMessage(
        "La reservación debe estar completamente pagada antes de finalizarla.",
      );
      return;
    }

    setValidationMessage(null);

    onFinish({
      finalComments: finalComments.trim(),
    });
  }

  return (
    <Dialog
      open={open}
      onClose={
        isSaving
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Cierre del evento
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          {balanceIsPaid && !chargesChanged ? (
            <Alert severity="success">
              Todos los pagos están completos. Puedes
              finalizar el evento o registrar cargos
              adicionales si fueron necesarios.
            </Alert>
          ) : balanceIsPaid && chargesChanged ? (
            <Alert severity="warning">
              Guarda los cargos adicionales. Si generan
              un nuevo saldo, deberás registrar el pago
              correspondiente antes de finalizar.
            </Alert>
          ) : (
            <Alert severity="warning">
              Todavía no puedes finalizar el evento.
              Guarda los cargos adicionales pendientes y
              registra el pago del saldo restante.
            </Alert>
          )}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
            }}
          >
            Cargos adicionales
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Horas extra"
            value={extraHours}
            disabled={isSaving}
            onChange={(event) => {
              const value =
                event.target.value;

              setExtraHours(
                value === ""
                  ? ""
                  : Math.max(
                      0,
                      Number(value),
                    ),
              );

              clearValidationMessage();
            }}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.5,
              },
            }}
            helperText={`Precio por hora: ${formatCurrency(
              extraHourPrice,
            )}`}
          />

          {numericExtraHours > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 2,
              }}
            >
              <Typography color="text.secondary">
                Cargo por horas extra
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {formatCurrency(
                  extraHoursCharge,
                )}
              </Typography>
            </Box>
          )}

          <Divider />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Descripción de desperfectos"
            value={damageDescription}
            disabled={isSaving}
            error={
              hasDamageChargeWithoutDescription
            }
            helperText={
              hasDamageChargeWithoutDescription
                ? "Describe el desperfecto que genera el cobro."
                : "Opcional si no hubo desperfectos."
            }
            onChange={(event) => {
              setDamageDescription(
                event.target.value,
              );

              clearValidationMessage();
            }}
            placeholder="Ejemplo: se rompieron dos sillas..."
          />

          <TextField
            fullWidth
            type="number"
            label="Cargo por desperfectos"
            value={damageCharge}
            disabled={isSaving}
            onChange={(event) => {
              const value =
                event.target.value;

              setDamageCharge(
                value === ""
                  ? ""
                  : Math.max(
                      0,
                      Number(value),
                    ),
              );

              clearValidationMessage();
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

          {!balanceIsPaid && (
            <>
              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Saldo pendiente actual
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "secondary.main",
                  }}
                >
                  {formatCurrency(
                    currentRemainingBalance,
                  )}
                </Typography>
              </Box>
            </>
          )}

          {balanceIsPaid && !chargesChanged && (
            <>
              <Divider />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                }}
              >
                Comentarios finales
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Comentarios finales"
                value={finalComments}
                disabled={isSaving}
                onChange={(event) => {
                  setFinalComments(
                    event.target.value,
                  );
                }}
                placeholder="Ejemplo: dejaron el salón limpio y entregaron a tiempo..."
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          variant="outlined"
          disabled={isSaving}
          onClick={onClose}
        >
          Cancelar
        </Button>

        {chargesChanged ? (
          <Button
            variant="contained"
            disabled={
              isSaving ||
              hasDamageChargeWithoutDescription
            }
            onClick={handleSaveCharges}
          >
            {isSaving
              ? "Guardando..."
              : "Guardar cargos"}
          </Button>
        ) : balanceIsPaid ? (
          <Button
            variant="contained"
            disabled={isSaving}
            onClick={handleFinish}
          >
            {isSaving
              ? "Finalizando..."
              : "Finalizar evento"}
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled
          >
            Saldo pendiente
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default FinishReservationDialog;