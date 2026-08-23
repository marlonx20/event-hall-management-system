from __future__ import annotations

import logging
import socket
import threading
import time
import webbrowser

import uvicorn
from app.core.paths import APP_DATA_DIRECTORY
from app.main import app

SERVER_HOST = "0.0.0.0"
LOCAL_HOST = "127.0.0.1"
PORT = 8000

LOCAL_APPLICATION_URL = f"http://{LOCAL_HOST}:{PORT}"

LOGS_DIRECTORY = APP_DATA_DIRECTORY / "logs"
LOG_FILE = LOGS_DIRECTORY / "application.log"


def configure_logging() -> None:
    LOGS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.INFO,
        format=("%(asctime)s | %(levelname)s | %(name)s | %(message)s"),
        encoding="utf-8",
    )


def get_local_ip_address() -> str | None:
    try:
        with socket.socket(
            socket.AF_INET,
            socket.SOCK_DGRAM,
        ) as connection:
            connection.connect(
                ("8.8.8.8", 80),
            )

            return connection.getsockname()[0]
    except OSError:
        return None


def log_access_urls() -> None:
    logger = logging.getLogger("salon_loryan")

    logger.info(
        "Acceso local: %s",
        LOCAL_APPLICATION_URL,
    )

    local_ip = get_local_ip_address()

    if local_ip is None:
        logger.warning(
            "No fue posible detectar la dirección IP de la red local.",
        )
        return

    network_url = f"http://{local_ip}:{PORT}"

    logger.info(
        "Acceso desde otros dispositivos de la red: %s",
        network_url,
    )


def wait_until_server_is_ready() -> None:
    deadline = time.monotonic() + 30

    while time.monotonic() < deadline:
        try:
            with socket.create_connection(
                (LOCAL_HOST, PORT),
                timeout=1,
            ):
                webbrowser.open(
                    LOCAL_APPLICATION_URL,
                    new=1,
                )
                return
        except OSError:
            time.sleep(0.25)


def main() -> None:
    configure_logging()
    log_access_urls()

    browser_thread = threading.Thread(
        target=wait_until_server_is_ready,
        daemon=True,
    )

    browser_thread.start()

    uvicorn.run(
        app,
        host=SERVER_HOST,
        port=PORT,
        log_level="info",
        access_log=False,
        log_config=None,
    )


if __name__ == "__main__":
    main()
