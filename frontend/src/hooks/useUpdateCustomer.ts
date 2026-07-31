import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateCustomer } from "../services/customerService";
import type { CustomerUpdate } from "../types/customer";

interface UpdateCustomerVariables {
  customerId: number;
  customerData: CustomerUpdate;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      customerData,
    }: UpdateCustomerVariables) =>
      updateCustomer(
        customerId,
        customerData,
      ),

    onSuccess: async (customer) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "customers",
            customer.id,
          ],
        }),
      ]);
    },
  });
}