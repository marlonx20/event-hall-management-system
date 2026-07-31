"""replace quick message display order with favorite

Revision ID: 01d3a9cc0149
Revises: aadf3ab61038
Create Date: 2026-07-27 14:24:11.310787

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01d3a9cc0149'
down_revision: Union[str, Sequence[str], None] = 'aadf3ab61038'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Replace display order with favorite flag."""

    with op.batch_alter_table(
        "quick_messages",
        schema=None,
    ) as batch_op:
        batch_op.add_column(
            sa.Column(
                "is_favorite",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )

        batch_op.drop_column(
            "display_order",
        )

    with op.batch_alter_table(
        "quick_messages",
        schema=None,
    ) as batch_op:
        batch_op.alter_column(
            "is_favorite",
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=None,
        )


def downgrade() -> None:
    """Restore display order and remove favorite flag."""

    with op.batch_alter_table(
        "quick_messages",
        schema=None,
    ) as batch_op:
        batch_op.add_column(
            sa.Column(
                "display_order",
                sa.Integer(),
                nullable=False,
                server_default="0",
            )
        )

        batch_op.drop_column(
            "is_favorite",
        )

    with op.batch_alter_table(
        "quick_messages",
        schema=None,
    ) as batch_op:
        batch_op.alter_column(
            "display_order",
            existing_type=sa.Integer(),
            nullable=False,
            server_default=None,
        )