import { useQueryClient } from "@tanstack/react-query";

import { useCancelReservation } from "../../hooks/useCancelReservation";
import { useCreatePayment } from "../../hooks/useCreatePayment";
import {
  useFinishReservation,
  useSaveClosingCharges,
} from "../../hooks/useFinishReservation";
import { useReservationPayments } from "../../hooks/useReservationPayments";
import { useSnackbar } from "../../hooks/useSnackbar";
import type { Dayjs } from "dayjs";

import type {
  PaymentConcept,
  PaymentMethod,
} from "../../types/payment";
import type { Reservation } from "../../types/reservation";
import { translateApiError } from "../../utils/translateApiError";
import CancelReservationDialog from "./CancelReservationDialog";
import FinishReservationDialog from "./FinishReservationDialog";
import RegisterPaymentDialog from "./RegisterPaymentDialog";

interface ReservationDialogsProps {
  reservation: Reservation;
  extraHourPrice: number;

  paymentDialogOpen: boolean;
  cancelDialogOpen: boolean;
  finishDialogOpen: boolean;

  onClosePaymentDialog: () => void;
  onCloseCancelDialog: () => void;
  onCloseFinishDialog: () => void;
}

function ReservationDialogs({
  reservation,
  extraHourPrice,
  paymentDialogOpen,
  cancelDialogOpen,
  finishDialogOpen,
  onClosePaymentDialog,
  onCloseCancelDialog,
  onCloseFinishDialog,
}: ReservationDialogsProps) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const createPaymentMutation =
    useCreatePayment();

  const cancelMutation =
    useCancelReservation();

  const finishMutation =
    useFinishReservation();

  const saveClosingChargesMutation =
    useSaveClosingCharges();

  const { data: payments = [] } =
    useReservationPayments(reservation.id);

  const hasDeposit = payments.some(
    (payment) => payment.concept === "deposit",
  );

  const closingOperationIsPending =
    saveClosingChargesMutation.isPending ||
    finishMutation.isPending;

  function refreshReservationData(): void {
    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      }),
      queryClient.invalidateQueries({
        queryKey: [
          "reservations",
          reservation.id,
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: [
          "reservations",
          reservation.id,
          "payments",
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      }),
    ]);
  }

  async function handleRegisterPayment(
    paymentData: {
      amount: number;
      paymentDate: Dayjs;
      method: PaymentMethod;
      concept: PaymentConcept;
      reference: string;
      receiptFile: File | null;
    },
  ): Promise<void> {
    try {
      await createPaymentMutation.mutateAsync({
        reservationId: reservation.id,
        paymentData: {
          amount: paymentData.amount,
          payment_date:
            paymentData.paymentDate.format(
              "YYYY-MM-DD",
            ),
          method: paymentData.method,
          concept: paymentData.concept,
          reference:
            paymentData.reference || null,
        },
        paymentReceiptFile:
          paymentData.receiptFile,
      });

      onClosePaymentDialog();

      showSnackbar({
        severity: "success",
        message:
          "Pago registrado correctamente.",
      });

      refreshReservationData();
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: translateApiError(
          error,
          "No fue posible registrar el pago.",
        ),
      });
    }
  }

  async function handleCancelReservation(): Promise<void> {
    try {
      await cancelMutation.mutateAsync(
        reservation.id,
      );

      onCloseCancelDialog();

      showSnackbar({
        severity: "success",
        message:
          "Reservación cancelada correctamente.",
      });

      refreshReservationData();
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: translateApiError(
          error,
          "No fue posible cancelar la reservación.",
        ),
      });
    }
  }

  async function handleSaveClosingCharges(
    data: {
      extraHours: number;
      damageDescription: string;
      damageCharge: number;
    },
  ): Promise<void> {
    try {
      await saveClosingChargesMutation.mutateAsync({
        reservationId: reservation.id,
        updateData: {
          extra_hours: data.extraHours,
          damage_description:
            data.damageDescription || null,
          damage_charge:
            data.damageCharge,
        },
      });

      onCloseFinishDialog();

      showSnackbar({
        severity: "success",
        message:
          "Cargos adicionales guardados correctamente.",
      });

      refreshReservationData();
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: translateApiError(
          error,
          "No fue posible guardar los cargos adicionales.",
        ),
      });
    }
  }

  async function handleFinishReservation(
    data: {
      finalComments: string;
    },
  ): Promise<void> {
    try {
      await finishMutation.mutateAsync({
        reservationId: reservation.id,
        finishData: {
          final_comments:
            data.finalComments || null,
        },
      });

      onCloseFinishDialog();

      showSnackbar({
        severity: "success",
        message:
          "Evento finalizado correctamente.",
      });

      refreshReservationData();
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: translateApiError(
          error,
          "No fue posible finalizar el evento.",
        ),
      });
    }
  }

  return (
    <>
      <RegisterPaymentDialog
        open={paymentDialogOpen}
        remainingBalance={Number(
          reservation.remaining_balance,
        )}
        reservationStatus={reservation.status}
        isSaving={createPaymentMutation.isPending}
        hasDeposit={hasDeposit}
        onClose={onClosePaymentDialog}
        onSave={(paymentData) => {
          void handleRegisterPayment(
            paymentData,
          );
        }}
      />

      <CancelReservationDialog
        open={cancelDialogOpen}
        isSaving={cancelMutation.isPending}
        onClose={onCloseCancelDialog}
        onConfirm={() => {
          void handleCancelReservation();
        }}
      />

      <FinishReservationDialog
        open={finishDialogOpen}
        extraHourPrice={extraHourPrice}
        currentRemainingBalance={Number(
          reservation.remaining_balance,
        )}
        currentExtraHours={Number(
          reservation.extra_hours ?? 0,
        )}
        currentDamageDescription={
          reservation.damage_description ?? ""
        }
        currentDamageCharge={Number(
          reservation.damage_charge ?? 0,
        )}
        isSaving={closingOperationIsPending}
        onClose={onCloseFinishDialog}
        onSaveCharges={(data) => {
          void handleSaveClosingCharges(
            data,
          );
        }}
        onFinish={(data) => {
          void handleFinishReservation(
            data,
          );
        }}
      />
    </>
  );
}

export default ReservationDialogs;