import { useMutation } from "@tanstack/react-query";

import {
  finishReservation,
  updateReservation,
} from "../services/reservationService";
import type {
  ReservationFinish,
  ReservationUpdate,
} from "../types/reservation";

export function useSaveClosingCharges() {
  return useMutation({
    mutationFn: ({
      reservationId,
      updateData,
    }: {
      reservationId: number;
      updateData: ReservationUpdate;
    }) =>
      updateReservation(
        reservationId,
        updateData,
      ),
  });
}

export function useFinishReservation() {
  return useMutation({
    mutationFn: ({
      reservationId,
      finishData,
    }: {
      reservationId: number;
      finishData: ReservationFinish;
    }) =>
      finishReservation(
        reservationId,
        finishData,
      ),
  });
}