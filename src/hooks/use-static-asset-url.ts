import { useMemo } from "react";
import { useStaticAssetMap } from "../contexts/static-asset-map-context";

export function useStaticAssetUrl(id?: string | null) {
  const assets = useStaticAssetMap();
  return useMemo(() => {
    return id ? assets[id] : undefined;
  }, [assets, id]);
}
