import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

import {
  useDeletePhoto,
  usePhotos,
  useUpdatePhotoFavorite,
  useUploadPhoto,
} from "../../hooks/usePhotos";
import type { Photo } from "../../types/photo";

const API_BASE_URL = "http://127.0.0.1:8000";

function getPhotoUrl(photo: Photo): string {
  return `${API_BASE_URL}${photo.url}`;
}

function PhotoGallery() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photoToDelete, setPhotoToDelete] =
    useState<Photo | null>(null);
  const [copyNoticeOpen, setCopyNoticeOpen] = useState(false);

  const {
    data: photos = [],
    isLoading,
    isError,
    refetch,
  } = usePhotos();

  const uploadMutation = useUploadPhoto();
  const favoriteMutation = useUpdatePhotoFavorite();
  const deleteMutation = useDeletePhoto();

  async function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const photoFile = event.target.files?.[0];

    if (!photoFile) {
      return;
    }

    await uploadMutation.mutateAsync(photoFile);
    event.target.value = "";
  }

  async function copyPhoto(photo: Photo) {
    try {
      const response = await fetch(getPhotoUrl(photo));
      const imageBlob = await response.blob();

      const pngBlob =
        imageBlob.type === "image/png"
          ? imageBlob
          : await convertImageBlobToPng(imageBlob);

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": pngBlob,
        }),
      ]);

      setCopyNoticeOpen(true);
    } catch {
      window.alert(
        "No fue posible copiar la fotografía. Prueba descargarla.",
      );
    }
  }

  async function convertImageBlobToPng(
    imageBlob: Blob,
  ): Promise<Blob> {
    const bitmap = await createImageBitmap(imageBlob);
    const canvas = document.createElement("canvas");

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context unavailable");
    }

    context.drawImage(bitmap, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Could not convert image"));
      }, "image/png");
    });
  }

  function downloadPhoto(photo: Photo) {
    const anchor = document.createElement("a");
    anchor.href = getPhotoUrl(photo);
    anchor.download = photo.original_name;
    anchor.target = "_blank";
    anchor.click();
  }

  function openPhoto(photo: Photo) {
  window.open(
    getPhotoUrl(photo),
    "_blank",
    "noopener,noreferrer",
  );
} 

  function confirmDelete() {
    if (!photoToDelete) {
      return;
    }

    deleteMutation.mutate(photoToDelete.id, {
      onSuccess: () => {
        setPhotoToDelete(null);
      },
    });
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              void refetch();
            }}
          >
            Reintentar
          </Button>
        }
      >
        No fue posible cargar las fotografías.
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            void handleFileSelection(event);
          }}
        />

        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          disabled={uploadMutation.isPending}
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          {uploadMutation.isPending
            ? "Subiendo..."
            : "Subir foto"}
        </Button>
      </Box>

      {uploadMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          No fue posible subir la fotografía.
        </Alert>
      )}

      {photos.length === 0 ? (
        <Card>
          <Box
            sx={{
              py: 7,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Todavía no hay fotografías
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 2.5,
              }}
            >
              Sube la primera foto para copiarla rápidamente
              cuando la necesites.
            </Typography>

            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              Subir foto
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid
              key={photo.id}
              size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
            >
              <Card
                sx={{
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={getPhotoUrl(photo)}
                    alt={photo.original_name}
                    sx={{
                      height: 220,
                      objectFit: "cover",
                    }}
                  />

                  <IconButton
                    aria-label={
                      photo.is_favorite
                        ? "Quitar de favoritas"
                        : "Marcar como favorita"
                    }
                    onClick={() => {
                      favoriteMutation.mutate({
                        photoId: photo.id,
                        isFavorite: !photo.is_favorite,
                      });
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255, 255, 255, 0.9)",

                      "&:hover": {
                        bgcolor: "#FFFFFF",
                      },
                    }}
                  >
                    {photo.is_favorite ? (
                      <FavoriteIcon color="secondary" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Box>

                <CardActions
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={0.5}>
  <Button
    size="small"
    startIcon={<ContentCopyIcon />}
    onClick={() => {
      void copyPhoto(photo);
    }}
  >
    Copiar
  </Button>

  <IconButton
    aria-label="Abrir foto"
    title="Abrir"
    onClick={() => {
      openPhoto(photo);
    }}
  >
    <OpenInNewIcon />
  </IconButton>

  <IconButton
    aria-label="Descargar foto"
    title="Descargar"
    onClick={() => {
      downloadPhoto(photo);
    }}
  >
    <DownloadIcon />
  </IconButton>
</Stack>

                  <IconButton
                    aria-label="Eliminar foto"
                    color="error"
                    onClick={() => {
                      setPhotoToDelete(photo);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={photoToDelete !== null}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setPhotoToDelete(null);
          }
        }}
      >
        <DialogTitle>Eliminar fotografía</DialogTitle>

        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar esta fotografía?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            disabled={deleteMutation.isPending}
            onClick={() => {
              setPhotoToDelete(null);
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            onClick={confirmDelete}
          >
            {deleteMutation.isPending
              ? "Eliminando..."
              : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copyNoticeOpen}
        autoHideDuration={2500}
        message="Fotografía copiada"
        onClose={() => {
          setCopyNoticeOpen(false);
        }}
      />
    </Box>
  );
}

export default PhotoGallery;