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

export interface FindStaticAssetOptions {
  id: string;
}

export interface ListStaticAssetsOptions {}

export interface CreateStaticAssetOptions {
  data: {
    file: File;
    name?: string;
  };
}

export interface UpdateStaticAssetOptions {
  id: string;
  data: {
    file?: File;
    name?: string;
  };
}

export interface DeleteStaticAssetOptions {
  id: string;
}
