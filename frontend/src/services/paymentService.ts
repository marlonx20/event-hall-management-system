import { httpClient } from "../api/httpClient";
import type {
  Payment,
  PaymentCreate,
} from "../types/payment";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "";

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

export function openPaymentReceipt(
  reservationId: number,
  paymentId: number,
): void {
  const receiptUrl =
    `${API_BASE_URL}/reservations/${reservationId}/payments/${paymentId}/receipt`;

  window.open(
    receiptUrl,
    "_blank",
    "noopener,noreferrer",
  );
}