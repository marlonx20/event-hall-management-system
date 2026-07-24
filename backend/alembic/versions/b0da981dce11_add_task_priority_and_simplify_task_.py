"""Add task priority and simplify task status.

Revision ID: b0da981dce11
Revises: 2e6b7287d763
Create Date: 2026-07-24 16:52:20.633260
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b0da981dce11"
down_revision: str | Sequence[str] | None = "2e6b7287d763"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Add task priority and remove the in-progress status."""

    # Conserva las tareas existentes que todavía estén en progreso.
    op.execute(
        """
        UPDATE tasks
        SET status = 'PENDING'
        WHERE status IN ('IN_PROGRESS', 'in_progress')
        """
    )

    # El valor temporal permite copiar las filas existentes al
    # reconstruir la tabla de SQLite.
    with op.batch_alter_table(
        "tasks",
        schema=None,
    ) as batch_op:
        batch_op.add_column(
            sa.Column(
                "priority",
                sa.Enum(
                    "LOW",
                    "MEDIUM",
                    "HIGH",
                    name="task_priority",
                    native_enum=False,
                ),
                server_default="MEDIUM",
                nullable=False,
            )
        )

        batch_op.alter_column(
            "status",
            existing_type=sa.VARCHAR(length=11),
            type_=sa.Enum(
                "PENDING",
                "COMPLETED",
                name="task_status",
                native_enum=False,
            ),
            existing_nullable=False,
        )

    # El valor predeterminado solo era necesario para migrar
    # correctamente las tareas que ya existían.
    with op.batch_alter_table(
        "tasks",
        schema=None,
    ) as batch_op:
        batch_op.alter_column(
            "priority",
            existing_type=sa.Enum(
                "LOW",
                "MEDIUM",
                "HIGH",
                name="task_priority",
                native_enum=False,
            ),
            server_default=None,
            existing_nullable=False,
        )


def downgrade() -> None:
    """Remove task priority and restore the previous status storage."""

    with op.batch_alter_table(
        "tasks",
        schema=None,
    ) as batch_op:
        batch_op.alter_column(
            "status",
            existing_type=sa.Enum(
                "PENDING",
                "COMPLETED",
                name="task_status",
                native_enum=False,
            ),
            type_=sa.VARCHAR(length=11),
            existing_nullable=False,
        )

        batch_op.drop_column("priority")