import { httpClient } from "../api/httpClient";
import type {
  Payment,
  PaymentCreate,
} from "../types/payment";

export async function createReservationPayment(
  reservationId: number,
  paymentData: PaymentCreate,
): Promise<Payment> {
  const response = await httpClient.post<Payment>(
    `/reservations/${reservationId}/payments`,
    paymentData,
  );

  return response.data;
}

export async function getReservationPayments(
  reservationId: number,
): Promise<Payment[]> {
  const response = await httpClient.get<Payment[]>(
    `/reservations/${reservationId}/payments`,
  );

  return response.data;
}

export async function uploadPaymentReceipt(
  reservationId: number,
  paymentId: number,
  file: File,
): Promise<void> {
  const formData = new FormData();

  formData.append(
    "receipt_file",
    file,
  );

  await httpClient.post(
    `/reservations/${reservationId}/payments/${paymentId}/receipt`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function openPaymentReceipt(
  reservationId: number,
  paymentId: number,
): Promise<void> {
  const response = await httpClient.get<Blob>(
    `/reservations/${reservationId}/payments/${paymentId}/receipt`,
    {
      responseType: "blob",
    },
  );

  const receiptUrl = URL.createObjectURL(
    response.data,
  );

  window.open(
    receiptUrl,
    "_blank",
    "noopener,noreferrer",
  );

  window.setTimeout(() => {
    URL.revokeObjectURL(receiptUrl);
  }, 60_000);
}