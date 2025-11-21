import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStaticAssetStore } from "../contexts/static-asset-store-context";
import { listStaticAssetsQueryKey } from "./use-list-static-assets";
import { getStaticAssetQueryKey } from "./use-get-static-asset";

export function useDeleteStaticAsset() {
  const staticAssetStore = useStaticAssetStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      options: Parameters<typeof staticAssetStore.deleteAsset>[0],
    ) => {
      return await staticAssetStore.deleteAsset(options);
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: listStaticAssetsQueryKey() });
      if (!id) return;
      queryClient.invalidateQueries({ queryKey: getStaticAssetQueryKey(id) });
    },
  });
}
