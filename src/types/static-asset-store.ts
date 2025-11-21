import type { StaticAsset } from "./static-asset";

export interface StaticAssetStore {
  getAsset: (
    options: FindStaticAssetOptions,
  ) => Promise<StaticAsset | null> | StaticAsset | null;
  listAssets: (
    options?: ListStaticAssetsOptions,
  ) => Promise<StaticAsset[]> | StaticAsset[];
  createAsset: (
    options: CreateStaticAssetOptions,
  ) => Promise<StaticAsset> | StaticAsset;
  deleteAsset: (
    options: DeleteStaticAssetOptions,
  ) => Promise<string | null> | string | null;
  updateAsset: (
    options: UpdateStaticAssetOptions,
  ) => Promise<StaticAsset> | StaticAsset;
}

interface FindStaticAssetOptions {
  id: string;
}

interface ListStaticAssetsOptions { }

interface CreateStaticAssetOptions {
  data: {
    file: File;
    name?: string;
  };
}

interface UpdateStaticAssetOptions {
  id: string;
  data: {
    file?: File;
    name?: string;
  };
}

interface DeleteStaticAssetOptions {
  id: string;
}
