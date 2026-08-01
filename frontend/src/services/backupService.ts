import { httpClient } from "../api/httpClient";

interface BackupDownload {
  blob: Blob;
  filename: string;
}

function getFilename(
  contentDisposition: string | undefined,
): string {
  if (!contentDisposition) {
    return "Salon_Backup.zip";
  }

  const utf8Match =
    contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/i,
    );

  if (utf8Match?.[1]) {
    return decodeURIComponent(
      utf8Match[1],
    );
  }

  const filenameMatch =
    contentDisposition.match(
      /filename="?([^"]+)"?/i,
    );

  return (
    filenameMatch?.[1] ??
    "Salon_Backup.zip"
  );
}

export async function createBackup(): Promise<BackupDownload> {
  const response = await httpClient.post<Blob>(
    "/backups",
    undefined,
    {
      responseType: "blob",
    },
  );

  return {
    blob: response.data,
    filename: getFilename(
      response.headers[
        "content-disposition"
      ],
    ),
  };
}

export function downloadBackup(
  backup: BackupDownload,
): void {
  const downloadUrl =
    URL.createObjectURL(
      backup.blob,
    );

  const anchor =
    document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = backup.filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(
      downloadUrl,
    );
  }, 1000);
}