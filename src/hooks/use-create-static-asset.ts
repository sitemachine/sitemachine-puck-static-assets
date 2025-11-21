import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStaticAssetStore } from "../contexts/static-asset-store-context";
import { listStaticAssetsQueryKey } from "./use-list-static-assets";

export function useCreateStaticAsset() {
  const queryClient = useQueryClient();
  const staticAssetStore = useStaticAssetStore();

  return useMutation({
    mutationFn: async (
      options: Parameters<typeof staticAssetStore.createAsset>[0],
    ) => {
      return await staticAssetStore.createAsset(options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listStaticAssetsQueryKey() });
    },
  });
}
