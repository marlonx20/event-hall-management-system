from __future__ import annotations

import logging
import socket
import threading
import time
import webbrowser

import uvicorn

from app.core.paths import APP_DATA_DIRECTORY
from app.main import app

HOST = "127.0.0.1"
PORT = 8000
APPLICATION_URL = f"http://{HOST}:{PORT}"

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


def wait_until_server_is_ready() -> None:
    deadline = time.monotonic() + 30

    while time.monotonic() < deadline:
        try:
            with socket.create_connection(
                (HOST, PORT),
                timeout=1,
            ):
                webbrowser.open(
                    APPLICATION_URL,
                    new=1,
                )
                return
        except OSError:
            time.sleep(0.25)


def main() -> None:
    configure_logging()

    browser_thread = threading.Thread(
        target=wait_until_server_is_ready,
        daemon=True,
    )
    browser_thread.start()

    uvicorn.run(
        app,
        host=HOST,
        port=PORT,
        log_level="info",
        access_log=False,
        log_config=None,
    )


if __name__ == "__main__":
    main()
