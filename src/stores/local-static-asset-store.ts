import { Dexie, type Table } from "dexie";
import type { StaticAsset } from "../types/static-asset";
import type { StaticAssetStore } from "../types/static-asset-store";

interface LocalAsset {
  id: string;
  name?: string;
  file: File;
  createdAt: Date;
  updatedAt: Date;
}

export function createLocalAssetStore({
  dbName = "local-static-assets",
}: {
  dbName?: string;
} = {}): StaticAssetStore {
  const db = new AssetDatabase({ dbName });
  const urlCache = new Map<string, string>();

  const getAssetUrl = (id: string, file: File) => {
    const cached = urlCache.get(id);
    if (cached) {
      return cached;
    }
    const url = URL.createObjectURL(file);
    urlCache.set(id, url);
    return url;
  };

  const toAsset = (stored: LocalAsset): StaticAsset => ({
    id: stored.id,
    name: stored.name,
    mimeType: stored.file.type,
    size: stored.file.size,
    url: getAssetUrl(stored.id, stored.file),
  });

  return {
    async listAssets() {
      const items = await db.assets.orderBy("createdAt").reverse().toArray();
      return items.map(toAsset);
    },

    async getAsset({ id }) {
      const found = await db.assets.get(id);
      return found ? toAsset(found) : null;
    },

    async createAsset({ data }) {
      const created: LocalAsset = {
        id: crypto.randomUUID(),
        name: data.name ?? data.file.name,
        file: data.file,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.assets.add(created);
      return toAsset(created);
    },

    async deleteAsset({ id }) {
      const found = await db.assets.get(id);
      if (!found) return null;

      const cachedUrl = urlCache.get(id);
      if (cachedUrl) {
        URL.revokeObjectURL(cachedUrl);
        urlCache.delete(id);
      }

      await db.assets.delete(id);

      return id;
    },

    async updateAsset({ id, data }): Promise<StaticAsset> {
      const found = await db.assets.get(id);
      if (!found) {
        throw new Error("Asset not found");
      }

      const updated: LocalAsset = {
        ...found,
        name: data.name ?? found.name,
        updatedAt: new Date(),
      };

      if (data.file) {
        updated.file = data.file;
        // Revoke old URL if it exists
        const cachedUrl = urlCache.get(id);
        if (cachedUrl) {
          URL.revokeObjectURL(cachedUrl);
          urlCache.delete(id);
        }
      }

      await db.assets.put(updated);
      return toAsset(updated);
    },
  };
}

class AssetDatabase extends Dexie {
  assets!: Table<LocalAsset, string>;

  constructor({ dbName }: { dbName: string }) {
    super(dbName);
    this.version(1).stores({
      assets: "id,createdAt",
    });
  }
}
