import { useQuery } from "@tanstack/react-query";

import { getCustomers } from "../services/customerService";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
}