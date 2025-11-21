import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStaticAssetStore } from "../contexts/static-asset-store-context";
import { listStaticAssetsQueryKey } from "./use-list-static-assets";
import { getStaticAssetQueryKey } from "./use-get-static-asset";

export function useUpdateStaticAsset() {
  const queryClient = useQueryClient();
  const staticAssetStore = useStaticAssetStore();

  return useMutation({
    mutationFn: async (
      options: Parameters<typeof staticAssetStore.updateAsset>[0],
    ) => {
      return await staticAssetStore.updateAsset(options);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: listStaticAssetsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getStaticAssetQueryKey(data.id),
      });
    },
  });
}
