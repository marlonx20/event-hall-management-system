import {
  Alert,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import type {
  PaymentConcept,
  PaymentMethod,
} from "../../types/payment";

interface RegisterPaymentDialogProps {
  open: boolean;
  hasDeposit: boolean;
  remainingBalance: number;
  isSaving: boolean;
  reservationStatus:
    | "pending"
    | "confirmed"
    | "finished"
    | "cancelled";
  onClose: () => void;
  onSave: (paymentData: {
    amount: number;
    paymentDate: Dayjs;
    method: PaymentMethod;
    concept: PaymentConcept;
    reference: string;
    receiptFile: File | null;
  }) => void;
}

function RegisterPaymentDialog({
  open,
  remainingBalance,
  isSaving,
  reservationStatus,
  hasDeposit,
  onClose,
  onSave,
}: RegisterPaymentDialogProps) {
  const [amount, setAmount] =
    useState<number | "">("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  const [paymentDate, setPaymentDate] =
    useState<Dayjs | null>(dayjs());

  const [method, setMethod] =
    useState<PaymentMethod | "">("");

  const [concept, setConcept] =
    useState<PaymentConcept>(
      reservationStatus === "pending" &&
        !hasDeposit
        ? "deposit"
        : "final_payment",
    );

  const [reference, setReference] =
    useState("");

  const [receiptFile, setReceiptFile] =
    useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setAmount("");
    setPaymentDate(dayjs());
    setValidationMessage(null);
    setMethod("");

    setConcept(
      reservationStatus === "pending" &&
        !hasDeposit
        ? "deposit"
        : "final_payment",
    );

    setReference("");
    setReceiptFile(null);
  }, [
    open,
    reservationStatus,
    hasDeposit,
  ]);

  const numericAmount =
    amount === "" ? 0 : Number(amount);

  const amountIsTooHigh =
    numericAmount > remainingBalance;

  function handleSave() {
    if (numericAmount <= 0) {
      setValidationMessage(
        "Ingresa un monto mayor que cero.",
      );
      return;
    }

    if (!paymentDate) {
      setValidationMessage(
        "Selecciona la fecha del pago.",
      );
      return;
    }

    if (!method) {
      setValidationMessage(
        "Selecciona el método de pago.",
      );
      return;
    }

    if (numericAmount > remainingBalance) {
      setValidationMessage(
        "El monto no puede superar el saldo pendiente.",
      );
      return;
    }

    if (
      concept === "final_payment" &&
      numericAmount !== remainingBalance
    ) {
      setValidationMessage(
        `La liquidación debe cubrir exactamente el saldo pendiente: ${new Intl.NumberFormat(
          "es-MX",
          {
            style: "currency",
            currency: "MXN",
          },
        ).format(remainingBalance)}.`,
      );
      return;
    }

    setValidationMessage(null);

    onSave({
      amount: numericAmount,
      paymentDate,
      method,
      concept,
      reference: reference.trim(),
      receiptFile,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={
        isSaving ? undefined : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Registrar pago
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            type="number"
            label="Monto"
            value={amount}
            disabled={isSaving}
            error={amountIsTooHigh}
            helperText={
              amountIsTooHigh
                ? "El monto no puede superar el faltante."
                : `Faltante actual: ${new Intl.NumberFormat(
                    "es-MX",
                    {
                      style: "currency",
                      currency: "MXN",
                    },
                  ).format(
                    remainingBalance,
                  )}`
            }
            onChange={(event) => {
              const value =
                event.target.value;

              setAmount(
                value === ""
                  ? ""
                  : Number(value),
              );

              setValidationMessage(null);
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

          <DatePicker
            label="Fecha del pago"
            value={paymentDate}
            disabled={isSaving}
            onChange={(value) => {
              setPaymentDate(value);
              setValidationMessage(null);
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />

          <FormControl
            fullWidth
            size="small"
            required
            disabled={isSaving}
          >
            <InputLabel>
              Método de pago
            </InputLabel>

            <Select
              label="Método de pago"
              value={method}
              onChange={(event) => {
                const nextMethod =
                  event.target
                    .value as PaymentMethod;

                setMethod(nextMethod);

                if (
                  nextMethod !== "transfer"
                ) {
                  setReceiptFile(null);
                }

                setValidationMessage(null);
              }}
            >
              <MenuItem value="cash">
                Efectivo
              </MenuItem>

              <MenuItem value="transfer">
                Transferencia
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            disabled={isSaving}
          >
            <InputLabel>
              Concepto
            </InputLabel>

            <Select
              label="Concepto"
              value={concept}
              onChange={(event) => {
                setConcept(
                  event.target
                    .value as PaymentConcept,
                );

                setValidationMessage(null);
              }}
            >
              {!hasDeposit && (
                <MenuItem value="deposit">
                  Anticipo
                </MenuItem>
              )}

              <MenuItem value="final_payment">
                Liquidación
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Referencia / comprobante"
            value={reference}
            disabled={isSaving}
            onChange={(event) => {
              setReference(
                event.target.value,
              );
            }}
            placeholder="Opcional"
          />

          {method === "transfer" && (
            <Box>
              <Button
                component="label"
                fullWidth
                variant="outlined"
                disabled={isSaving}
              >
                {receiptFile
                  ? "Cambiar fotografía"
                  : "Agregar fotografía del comprobante"}

                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const selectedFile =
                      event.target
                        .files?.[0] ??
                      null;

                    setReceiptFile(
                      selectedFile,
                    );

                    setValidationMessage(
                      null,
                    );

                    event.target.value =
                      "";
                  }}
                />
              </Button>

              {receiptFile && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 1,
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {receiptFile.name}
                  </Typography>

                  <Button
                    size="small"
                    color="error"
                    disabled={isSaving}
                    onClick={() => {
                      setReceiptFile(null);
                    }}
                  >
                    Quitar
                  </Button>
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3 }}
      >
        <Button
          variant="outlined"
          disabled={isSaving}
          onClick={onClose}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving
            ? "Guardando..."
            : "Registrar pago"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegisterPaymentDialog;