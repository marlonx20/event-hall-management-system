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