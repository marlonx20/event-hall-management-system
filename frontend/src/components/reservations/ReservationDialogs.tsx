import { useEffect } from "react";

import type { Reservation } from "../../types/reservation";
import { useCancelReservation } from "../../hooks/useCancelReservation";
import { useCreatePayment } from "../../hooks/useCreatePayment";
import {
  useFinishReservation,
  useSaveClosingCharges,
} from "../../hooks/useFinishReservation";
import { useReservationPayments } from "../../hooks/useReservationPayments";
import { useSnackbar } from "../../hooks/useSnackbar";
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
  const { showSnackbar } = useSnackbar();

  const createPaymentMutation = useCreatePayment();
  const cancelMutation = useCancelReservation();
  const finishMutation = useFinishReservation();
  const saveClosingChargesMutation = useSaveClosingCharges();

  const { data: payments = [] } =
    useReservationPayments(reservation.id);

  const hasDeposit = payments.some(
    (payment) => payment.concept === "deposit",
  );

  useEffect(() => {
    if (paymentDialogOpen) {
      createPaymentMutation.reset();
    }
  }, [paymentDialogOpen, createPaymentMutation]);

  useEffect(() => {
    if (cancelDialogOpen) {
      cancelMutation.reset();
    }
  }, [cancelDialogOpen, cancelMutation]);

  useEffect(() => {
    if (finishDialogOpen) {
      saveClosingChargesMutation.reset();
      finishMutation.reset();
    }
  }, [
    finishDialogOpen,
    saveClosingChargesMutation,
    finishMutation,
  ]);

  const closingOperationIsPending =
    saveClosingChargesMutation.isPending ||
    finishMutation.isPending;

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
        onClose={() => {
          if (!createPaymentMutation.isPending) {
            onClosePaymentDialog();
          }
        }}
        onSave={(paymentData) => {
          createPaymentMutation.mutate(
            {
              reservationId: reservation.id,
              paymentData: {
                amount: paymentData.amount,
                payment_date: paymentData.paymentDate.format("YYYY-MM-DD"),
                method: paymentData.method,
                concept: paymentData.concept,
                reference: paymentData.reference || null,
              },
              paymentReceiptFile: paymentData.receiptFile,
            },
            {
              onSuccess: () => {
                onClosePaymentDialog();
                showSnackbar({
                  severity: "success",
                  message: "Pago registrado correctamente.",
                });
              },
              onError: (error) => {
                showSnackbar({
                  severity: "error",
                  message: translateApiError(error, "No fue posible registrar el pago."),
                });
              },
            },
          );
        }}
      />

      <CancelReservationDialog
        open={cancelDialogOpen}
        isSaving={cancelMutation.isPending}
        onClose={() => {
          if (!cancelMutation.isPending) {
            onCloseCancelDialog();
          }
        }}
        onConfirm={() => {
          cancelMutation.mutate(reservation.id, {
            onSuccess: () => {
              onCloseCancelDialog();
              showSnackbar({
                severity: "success",
                message: "Reservación cancelada correctamente.",
              });
            },
            onError: (error) => {
              showSnackbar({
                severity: "error",
                message: translateApiError(error, "No fue posible cancelar la reservación."),
              });
            },
          });
        }}
      />

      <FinishReservationDialog
        open={finishDialogOpen}
        extraHourPrice={extraHourPrice}
        currentRemainingBalance={Number(reservation.remaining_balance)}
        currentExtraHours={Number(reservation.extra_hours ?? 0)}
        currentDamageDescription={reservation.damage_description ?? ""}
        currentDamageCharge={Number(reservation.damage_charge ?? 0)}
        isSaving={closingOperationIsPending}
        onClose={() => {
          if (!closingOperationIsPending) {
            onCloseFinishDialog();
          }
        }}
        onSaveCharges={(data) => {
          saveClosingChargesMutation.mutate(
            {
              reservationId: reservation.id,
              updateData: {
                extra_hours: data.extraHours,
                damage_description: data.damageDescription || null,
                damage_charge: data.damageCharge,
              },
            },
            {
              onSuccess: () => {
                onCloseFinishDialog();
                showSnackbar({
                  severity: "success",
                  message: "Cargos adicionales guardados correctamente.",
                });
              },
              onError: (error) => {
                showSnackbar({
                  severity: "error",
                  message: translateApiError(error, "No fue posible guardar los cargos adicionales."),
                });
              },
            },
          );
        }}
        onFinish={(data) => {
          finishMutation.mutate(
            {
              reservationId: reservation.id,
              finishData: {
                final_comments: data.finalComments || null,
              },
            },
            {
              onSuccess: () => {
                onCloseFinishDialog();
                showSnackbar({
                  severity: "success",
                  message: "Evento finalizado correctamente.",
                });
              },
              onError: (error) => {
                showSnackbar({
                  severity: "error",
                  message: translateApiError(error, "No fue posible finalizar el evento."),
                });
              },
            },
          );
        }}
      />
    </>
  );
}

export default ReservationDialogs;