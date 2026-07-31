import { useQuery } from "@tanstack/react-query";

import { getCustomer } from "../services/customerService";

export function useCustomer(
  customerId: number,
) {
  return useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => getCustomer(customerId),
    enabled: customerId > 0,
  });
}