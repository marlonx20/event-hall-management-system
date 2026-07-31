import { useQuery } from "@tanstack/react-query";

import { searchCustomers } from "../services/customerService";

export function useCustomerSearch(
  query: string,
) {
  return useQuery({
    queryKey: [
      "customer-search",
      query,
    ],
    queryFn: () =>
      searchCustomers(query),
    enabled: query.trim().length >= 2,
  });
}