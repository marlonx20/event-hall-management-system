import { isAxiosError } from "axios";

const API_ERROR_TRANSLATIONS: Record<string, string> = {
  "Another reservation is already confirmed for this date":
    "Ya existe otra reservación confirmada para esta fecha.",

  "A confirmed reservation already exists for this date":
    "Ya existe una reservación confirmada para esta fecha.",

  "A cancelled reservation cannot be updated":
    "No se puede modificar una reservación cancelada.",

  "A finished reservation cannot be updated":
    "No se puede modificar una reservación finalizada.",

  "Customer not found":
    "No se encontró el cliente seleccionado.",

  "Reservation not found":
    "No se encontró la reservación.",

  "Venue configuration not found":
    "No se encontró la configuración del salón.",

  "Additional charges cannot be reduced below the amount already paid":
    "El total de la reservación no puede ser menor que la cantidad ya pagada.",

  "Reservation is already cancelled":
    "La reservación ya está cancelada.",

  "A finished reservation cannot be cancelled":
    "No se puede cancelar una reservación finalizada.",

  "Only confirmed reservations can be finished":
    "Solo se pueden finalizar reservaciones confirmadas.",

  "Reservation cannot be finished until the balance is fully paid":
    "La reservación no puede finalizarse hasta liquidar completamente el saldo.",

  "Cannot register a payment for a cancelled reservation":
    "No se pueden registrar pagos en una reservación cancelada.",

  "Cannot register a payment for a finished reservation":
  
    "No se pueden registrar pagos en una reservación finalizada.",

  "Extra hours and damage payments require a confirmed reservation":
    "Los pagos por horas extra o daños requieren una reservación confirmada.",

  "A deposit has already been registered for this reservation":
    "Ya se registró un anticipo para esta reservación.",

  "Payment amount exceeds remaining balance":
    "El pago excede el saldo pendiente.",

  "Final payment must cover the entire remaining balance":
    "La liquidación debe cubrir todo el saldo pendiente.",
};

interface ApiErrorResponse {
  detail?: unknown;
}

export function translateApiError(
  error: unknown,
  fallbackMessage = "Ocurrió un error inesperado.",
): string {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return API_ERROR_TRANSLATIONS[detail] ?? detail;
  }

  if (Array.isArray(detail)) {
    const validationMessages = detail
      .map((item: unknown) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "msg" in item &&
          typeof item.msg === "string"
        ) {
          return item.msg;
        }

        return null;
      })
      .filter(
        (message): message is string =>
          message !== null,
      );

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }
  }

  if (!error.response) {
    return "No fue posible comunicarse con el servidor.";
  }

  return fallbackMessage;
}