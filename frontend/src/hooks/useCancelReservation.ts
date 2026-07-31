import { useMutation } from "@tanstack/react-query";

import { cancelReservation } from "../services/reservationService";
import type { Reservation } from "../types/reservation";

export function useCancelReservation() {
  return useMutation<
    Reservation,
    Error,
    number
  >({
    mutationFn: cancelReservation,
  });
}