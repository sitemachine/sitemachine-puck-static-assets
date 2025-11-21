import { useQuery } from "@tanstack/react-query";
import { useStaticAssetStore } from "../contexts/static-asset-store-context";

export function listStaticAssetsQueryKey() {
  return ["static-assets", "list"];
}

export function useListStaticAssets() {
  const staticAssetStore = useStaticAssetStore();
  return useQuery({
    queryKey: listStaticAssetsQueryKey(),
    queryFn: () => staticAssetStore.listAssets({}),
  });
}
