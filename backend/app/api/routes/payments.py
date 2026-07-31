from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.crud import reservation as reservation_crud
from app.dependencies.database import get_db
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentRead
from app.services import (
    payment_receipt_service,
    payment_service,
)

router = APIRouter(
    prefix="/reservations/{reservation_id}/payments",
    tags=["Payments"],
)


def get_payment_or_404(
    db: Session,
    reservation_id: int,
    payment_id: int,
) -> Payment:
    payment = payment_crud.get_payment(
        db,
        payment_id,
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    if payment.reservation_id != reservation_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    return payment


@router.post(
    "",
    response_model=PaymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    reservation_id: int,
    payment_data: PaymentCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Payment:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    try:
        return payment_service.register_payment(
            db,
            reservation,
            payment_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get("", response_model=list[PaymentRead])
def get_payments(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> list[Payment]:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    return payment_crud.get_payments_by_reservation(
        db,
        reservation_id,
    )


@router.post(
    "/{payment_id}/receipt",
    response_model=PaymentRead,
)
async def upload_payment_receipt(
    reservation_id: int,
    payment_id: int,
    db: Annotated[Session, Depends(get_db)],
    receipt_file: Annotated[UploadFile, File()],
) -> PaymentRead:

    payment = get_payment_or_404(
        db,
        reservation_id,
        payment_id,
    )

    content_type = receipt_file.content_type

    if content_type is None:
        raise HTTPException(
            status_code=400,
            detail="The file has no content type",
        )

    try:
        content = await receipt_file.read()

        payment = payment_receipt_service.save_receipt(
            db=db,
            payment=payment,
            original_name=receipt_file.filename or "receipt",
            content_type=content_type,
            file_content=content,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    finally:
        await receipt_file.close()

    return PaymentRead.model_validate(payment)


@router.get("/{payment_id}/receipt")
def get_payment_receipt(
    reservation_id: int,
    payment_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:

    payment = get_payment_or_404(
        db,
        reservation_id,
        payment_id,
    )

    file_path = payment_receipt_service.get_receipt_path(
        payment,
    )

    if file_path is None or not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Receipt not found",
        )

    return FileResponse(
        path=file_path,
        media_type=payment.receipt_content_type,
        filename=payment.receipt_original_name,
    )


@router.delete(
    "/{payment_id}/receipt",
    response_model=PaymentRead,
)
def delete_payment_receipt(
    reservation_id: int,
    payment_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> PaymentRead:

    payment = get_payment_or_404(
        db,
        reservation_id,
        payment_id,
    )

    payment = payment_receipt_service.delete_receipt(
        db,
        payment,
    )

    return PaymentRead.model_validate(payment)
