import { useQuery } from "@tanstack/react-query";

import { getReservationPayments } from "../services/paymentService";

export function useReservationPayments(
  reservationId: number,
) {
  return useQuery({
    queryKey: [
      "reservations",
      reservationId,
      "payments",
    ],
    queryFn: () =>
      getReservationPayments(reservationId),
    enabled: reservationId > 0,
  });
}