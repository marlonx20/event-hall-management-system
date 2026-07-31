import { useMutation } from "@tanstack/react-query";

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
  });
}