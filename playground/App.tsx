import {
  createLocalAssetStore,
  createStaticAssetPlugin,
  RenderWithStaticAssets,
} from "../src/index";
import { Puck, Button, type Config, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { createStaticAssetField } from "../src/fields/static-asset-field";
import { useStaticAssetUrl } from "../src/hooks/use-static-asset-url";
import type { StaticAssetMap } from "../src/contexts/static-asset-map-context";
import type { StaticAsset } from "../src/types/static-asset";

const CONFIG: Config = {
  components: {
    Image: {
      fields: {
        image: createStaticAssetField({
          label: "Image",
          accept: ["image/*"],
        }),
      },
      render({ image }) {
        const url = useStaticAssetUrl(image?.id);
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {url ? (
              <img src={url} width={200} height={200} alt="Static Asset" />
            ) : (
              <div>No image selected</div>
            )}
          </div>
        );
      },
    },
  },
};

const DEFAULT_DATA: Data = {
  root: {
    props: {},
  },
  content: [
    {
      type: "Image",
      props: {
        id: "Image-f99c546b-87eb-437c-864b-8eea6a06708d",
      },
    },
  ],
  zones: {},
};

// Instantiate store outside component to persist across re-renders
const store = createLocalAssetStore();

export default function App() {
  const [data, setData] = useLocalStorage(
    "puck-static-assets:data",
    () => DEFAULT_DATA,
  );
  const [view, setView] = useState<"editor" | "renderer">("editor");
  const [assets, setAssets] = useState<StaticAsset[] | null>(null);

  useEffect(() => {
    if (view === "renderer") {
      Promise.resolve(store.listAssets()).then(setAssets);
    }
  }, [view]);

  const assetMap: StaticAssetMap = useMemo(() => {
    if (!assets) return {};

    return Object.fromEntries(assets.map((asset) => [asset.id, asset.url]));
  }, [assets]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          gap: "10px",
        }}
      >
        <Button
          onClick={() => setView("editor")}
          variant={view === "editor" ? "primary" : "secondary"}
        >
          Editor
        </Button>
        <Button
          onClick={() => setView("renderer")}
          variant={view === "renderer" ? "primary" : "secondary"}
        >
          Renderer
        </Button>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {view === "editor" ? (
          <Editor data={data} onChange={setData} />
        ) : (
          <Renderer data={data} assetMap={assetMap} />
        )}
      </div>
    </div>
  );
}

function Editor({
  data,
  onChange,
}: {
  data: Data;
  onChange: (data: Data) => void;
}) {
  const plugins = useMemo(
    () => [
      createStaticAssetPlugin({
        store,
      }),
    ],
    [],
  );

  return (
    <Puck
      data={data}
      config={CONFIG}
      plugins={plugins}
      onChange={(newData) => onChange(newData)}
    />
  );
}

function Renderer({
  data,
  assetMap,
}: {
  data: Data;
  assetMap: StaticAssetMap;
}) {
  return (
    <RenderWithStaticAssets data={data} config={CONFIG} assets={assetMap} />
  );
}
