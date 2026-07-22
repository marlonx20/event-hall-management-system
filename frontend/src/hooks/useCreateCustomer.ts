import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCustomer } from "../services/customerService";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
}