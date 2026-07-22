import { httpClient } from "../api/httpClient";
import type { Photo } from "../types/photo";

export async function getPhotos(): Promise<Photo[]> {
  const response = await httpClient.get<Photo[]>("/photos");

  return response.data;
}

export async function uploadPhoto(
  photoFile: File,
): Promise<Photo> {
  const formData = new FormData();
  formData.append("photo_file", photoFile);

  const response = await httpClient.post<Photo>(
    "/photos",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function updatePhotoFavorite(
  photoId: number,
  isFavorite: boolean,
): Promise<Photo> {
  const response = await httpClient.put<Photo>(
    `/photos/${photoId}/favorite`,
    {
      is_favorite: isFavorite,
    },
  );

  return response.data;
}

export async function deletePhoto(
  photoId: number,
): Promise<void> {
  await httpClient.delete(`/photos/${photoId}`);
}