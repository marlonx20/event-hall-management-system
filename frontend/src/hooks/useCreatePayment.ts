import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createReservationPayment } from "../services/paymentService";
import type { PaymentCreate } from "../types/payment";

interface CreatePaymentVariables {
  reservationId: number;
  paymentData: PaymentCreate;
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, paymentData }: CreatePaymentVariables) =>
      createReservationPayment(reservationId, paymentData),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reservations", variables.reservationId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reservations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reservations", variables.reservationId, "payments"],
        }),
      ]);
    },
  });
}
