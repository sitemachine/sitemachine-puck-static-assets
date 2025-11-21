import { Render } from "@measured/puck";
import {
  StaticAssetMapProvider,
  type StaticAssetMap,
} from "../contexts/static-asset-map-context";
import type { ComponentProps } from "react";

export function RenderWithStaticAssets({
  assets,
  ...props
}: ComponentProps<typeof Render> & { assets: StaticAssetMap }) {
  return (
    <StaticAssetMapProvider value={assets}>
      <Render {...props} />
    </StaticAssetMapProvider>
  );
}
