import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  finishReservation,
  updateReservation,
} from "../services/reservationService";
import type {
  ReservationFinish,
  ReservationUpdate,
} from "../types/reservation";

export function useSaveClosingCharges() {
  const queryClient = useQueryClient();

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

    onSuccess: async (reservation) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reservations"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "reservations",
            reservation.id,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["calendar"],
        }),
      ]);
    },
  });
}

export function useFinishReservation() {
  const queryClient = useQueryClient();

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

    onSuccess: async (reservation) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reservations"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "reservations",
            reservation.id,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["calendar"],
        }),
      ]);
    },
  });
}