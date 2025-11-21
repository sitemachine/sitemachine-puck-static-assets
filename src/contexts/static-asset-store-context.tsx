import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { StaticAssetStore } from "../types/static-asset-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const StaticAssetStoreContext = createContext<StaticAssetStore | null>(null);

export function StaticAssetStoreProvider({
  children,
  store,
}: PropsWithChildren<{ store: StaticAssetStore }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StaticAssetStoreContext.Provider value={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StaticAssetStoreContext.Provider>
  );
}

export function useStaticAssetStore() {
  const context = useContext(StaticAssetStoreContext);
  if (!context) {
    throw new Error(
      "useStaticAssetStore must be used within a StaticAssetStoreProvider",
    );
  }
  return context;
}
