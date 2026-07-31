import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createReservationPayment,
  uploadPaymentReceipt,
} from "../services/paymentService";
import type { PaymentCreate } from "../types/payment";

interface CreatePaymentVariables {
  reservationId: number;
  paymentData: PaymentCreate;
  paymentReceiptFile: File | null;
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reservationId,
      paymentData,
      paymentReceiptFile,
    }: CreatePaymentVariables) => {
      const payment =
        await createReservationPayment(
          reservationId,
          paymentData,
        );

      if (
        paymentData.method === "transfer" &&
        paymentReceiptFile
      ) {
        await uploadPaymentReceipt(
          reservationId,
          payment.id,
          paymentReceiptFile,
        );
      }

      return payment;
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "reservations",
            variables.reservationId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reservations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "reservations",
            variables.reservationId,
            "payments",
          ],
        }),
      ]);
    },
  });
}