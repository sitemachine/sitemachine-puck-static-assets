import { createContext, useContext, type PropsWithChildren } from "react";

export type StaticAssetMap = Record<string, string>;

const StaticAssetMapContext = createContext<StaticAssetMap>({});

export const useStaticAssetMap = (): StaticAssetMap =>
  useContext(StaticAssetMapContext);

export function StaticAssetMapProvider({
  value,
  children,
}: PropsWithChildren<{ value: StaticAssetMap }>) {
  return (
    <StaticAssetMapContext.Provider value={value}>
      {children}
    </StaticAssetMapContext.Provider>
  );
}
