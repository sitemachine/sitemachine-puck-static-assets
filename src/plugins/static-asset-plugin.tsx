import type { Plugin } from "@measured/puck";
import type { StaticAssetStore } from "../types/static-asset-store";
import { StaticAssetStoreProvider } from "../contexts/static-asset-store-context";
import { Provider } from "../components/ui/provider";
import { useListStaticAssets } from "../hooks/use-list-static-assets";
import { StaticAssetMapProvider } from "../contexts/static-asset-map-context";
import { useMemo, type PropsWithChildren } from "react";

export function createStaticAssetPlugin({
  store,
}: {
  store: StaticAssetStore;
}): Plugin {
  return {
    overrides: {
      puck: ({ children }) => {
        return (
          <StaticAssetStoreProvider store={store}>
            <_StaticAssetMapProvider>
              <Provider defaultTheme="light">{children}</Provider>
            </_StaticAssetMapProvider>
          </StaticAssetStoreProvider>
        );
      },
    },
  };
}

function _StaticAssetMapProvider({ children }: PropsWithChildren) {
  const query = useListStaticAssets();
  const map = useMemo(() => {
    if (!query.data) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(query.data).map(([_, value]) => [value.id, value.url]),
    );
  }, [query.data]);
  return (
    <StaticAssetMapProvider value={map}>{children}</StaticAssetMapProvider>
  );
}
