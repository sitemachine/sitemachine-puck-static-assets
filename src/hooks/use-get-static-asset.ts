import { useQuery } from "@tanstack/react-query";
import { useStaticAssetStore } from "../contexts/static-asset-store-context";

export function getStaticAssetQueryKey(id: string) {
  return ["static-assets", id];
}

export function useGetStaticAsset(id?: string) {
  const staticAssetStore = useStaticAssetStore();
  return useQuery({
    queryKey: id ? getStaticAssetQueryKey(id) : [],
    queryFn: () => staticAssetStore.getAsset({ id: id! }),
    enabled: !!id,
  });
}
