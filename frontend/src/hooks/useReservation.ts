import { useQuery } from "@tanstack/react-query";

import { getReservation } from "../services/reservationService";

export function useReservation(
  reservationId: number,
) {
  return useQuery({
    queryKey: ["reservations", reservationId],
    queryFn: () => getReservation(reservationId),
    enabled: reservationId > 0,
  });
}