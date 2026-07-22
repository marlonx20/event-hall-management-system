import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateReservation } from "../services/reservationService";
import type {
  Reservation,
  ReservationUpdate,
} from "../types/reservation";

interface UpdateReservationVariables {
  reservationId: number;
  reservationData: ReservationUpdate;
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    Error,
    UpdateReservationVariables
  >({
    mutationFn: ({
      reservationId,
      reservationData,
    }) =>
      updateReservation(
        reservationId,
        reservationData,
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