import { useQuery } from "@tanstack/react-query";

import { searchReservations } from "../services/reservationService";

export function useReservationSearch(
  query: string,
) {
  return useQuery({
    queryKey: [
      "reservation-search",
      query,
    ],
    queryFn: () =>
      searchReservations(query),
    enabled: query.trim().length >= 2,
  });
}