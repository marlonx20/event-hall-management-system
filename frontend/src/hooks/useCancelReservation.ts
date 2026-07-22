import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cancelReservation } from "../services/reservationService";
import type { Reservation } from "../types/reservation";

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    Error,
    number
  >({
    mutationFn: cancelReservation,

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