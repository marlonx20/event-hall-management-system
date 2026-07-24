from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context
from app.db.base import Base
from app.models import (
    customer,
    payment,
    photo,
    quick_message,
    reservation,
    task,
    venue,
)

# Estos módulos deben importarse para registrar todos los modelos
# dentro de Base.metadata antes de ejecutar las migraciones.
MODEL_MODULES = (
    customer,
    payment,
    photo,
    quick_message,
    reservation,
    task,
    venue,
)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Ejecuta migraciones sin crear una conexión directa."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named",
        },
        compare_type=True,
        render_as_batch=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Ejecuta migraciones utilizando una conexión a la base de datos."""

    configuration = config.get_section(
        config.config_ini_section,
        {},
    )

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
