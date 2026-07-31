import { useQuery } from "@tanstack/react-query";

import { getCustomerReservations } from "../services/customerService";

export function useCustomerReservations(
  customerId: number,
) {
  return useQuery({
    queryKey: [
      "customers",
      customerId,
      "reservations",
    ],
    queryFn: () =>
      getCustomerReservations(customerId),
    enabled: customerId > 0,
  });
}