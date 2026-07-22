import { useQuery } from "@tanstack/react-query";

import { getReservations } from "../services/reservationService";

export function useReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: getReservations,
  });
}