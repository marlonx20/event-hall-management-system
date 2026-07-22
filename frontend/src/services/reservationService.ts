import { httpClient } from "../api/httpClient";
import type {
  Reservation,
  ReservationCreate,
  ReservationUpdate,
  ReservationFinish,
} from "../types/reservation";

export async function createReservation(
  reservationData: ReservationCreate,
): Promise<Reservation> {
  const response = await httpClient.post<Reservation>(
    "/reservations",
    reservationData,
  );

  return response.data;
}

export async function getReservations(): Promise<Reservation[]> {
  const response = await httpClient.get<Reservation[]>(
    "/reservations",
  );

  
  return response.data;
}


export async function getReservation(
  reservationId: number,
): Promise<Reservation> {
  const response = await httpClient.get<Reservation>(
    `/reservations/${reservationId}`,
  );

  return response.data;
}

export async function updateReservation(
  reservationId: number,
  reservationData: ReservationUpdate,
): Promise<Reservation> {
  const response = await httpClient.put<Reservation>(
    `/reservations/${reservationId}`,
    reservationData,
  );

  return response.data;
}

export async function cancelReservation(
  reservationId: number,
): Promise<Reservation> {
  const response = await httpClient.put<Reservation>(
    `/reservations/${reservationId}/cancel`,
  );

  return response.data;
}

export async function finishReservation(
  reservationId: number,
  finishData: ReservationFinish,
): Promise<Reservation> {
  const response = await httpClient.put<Reservation>(
    `/reservations/${reservationId}/finish`,
    finishData,
  );

  return response.data;
}