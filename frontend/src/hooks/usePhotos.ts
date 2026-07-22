import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deletePhoto,
  getPhotos,
  updatePhotoFavorite,
  uploadPhoto,
} from "../services/photoService";

export function usePhotos() {
  return useQuery({
    queryKey: ["photos"],
    queryFn: getPhotos,
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["photos"],
      });
    },
  });
}

interface UpdateFavoriteVariables {
  photoId: number;
  isFavorite: boolean;
}

export function useUpdatePhotoFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      photoId,
      isFavorite,
    }: UpdateFavoriteVariables) =>
      updatePhotoFavorite(photoId, isFavorite),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["photos"],
      });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["photos"],
      });
    },
  });
}