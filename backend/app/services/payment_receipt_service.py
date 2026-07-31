from pathlib import Path
from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.paths import PAYMENT_RECEIPTS_DIRECTORY
from app.models.payment import Payment

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_RECEIPT_SIZE = 10 * 1024 * 1024


def ensure_receipts_directory() -> None:
    PAYMENT_RECEIPTS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )


def get_receipt_path(
    payment: Payment,
) -> Path | None:
    if payment.receipt_filename is None:
        return None

    return PAYMENT_RECEIPTS_DIRECTORY / payment.receipt_filename


def save_receipt(
    db: Session,
    payment: Payment,
    original_name: str,
    content_type: str,
    file_content: bytes,
) -> Payment:
    extension = ALLOWED_CONTENT_TYPES.get(
        content_type,
    )

    if extension is None:
        raise ValueError(
            "Only JPEG, PNG and WebP images are allowed",
        )

    if not file_content:
        raise ValueError(
            "The uploaded receipt is empty",
        )

    if len(file_content) > MAX_RECEIPT_SIZE:
        raise ValueError(
            "The receipt cannot exceed 10 MB",
        )

    ensure_receipts_directory()

    previous_file_path = get_receipt_path(
        payment,
    )

    filename = f"{uuid4().hex}{extension}"

    new_file_path = PAYMENT_RECEIPTS_DIRECTORY / filename

    try:
        new_file_path.write_bytes(
            file_content,
        )

        payment.receipt_filename = filename
        payment.receipt_original_name = original_name
        payment.receipt_content_type = content_type

        db.commit()
        db.refresh(payment)

        if (
            previous_file_path is not None
            and previous_file_path != new_file_path
            and previous_file_path.exists()
        ):
            previous_file_path.unlink()

        return payment

    except Exception:
        db.rollback()

        if new_file_path.exists():
            new_file_path.unlink()

        raise


def delete_receipt(
    db: Session,
    payment: Payment,
) -> Payment:
    file_path = get_receipt_path(
        payment,
    )

    try:
        payment.receipt_filename = None
        payment.receipt_original_name = None
        payment.receipt_content_type = None

        db.commit()
        db.refresh(payment)

        if file_path is not None and file_path.exists():
            file_path.unlink()

        return payment

    except Exception:
        db.rollback()
        raise
