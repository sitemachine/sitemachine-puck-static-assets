# @sitemachine/puck-static-assets

A plugin for [Puck](https://github.com/puckeditor/puck) that adds support for managing static assets (images, files, etc.).

## Installation

```bash
npm install @sitemachine/puck-static-assets @measured/puck
```

## Usage

### 1. Configure the Plugin

Add the `createStaticAssetPlugin` to your Puck configuration. You'll need to provide a store implementation. `createLocalAssetStore` is provided for local development (uses IndexedDB).

```tsx
import { createStaticAssetPlugin, createLocalAssetStore } from "@sitemachine/puck-static-assets";

const plugins = [
  createStaticAssetPlugin({
    store: createLocalAssetStore(),
  }),
];

// Pass to Puck
<Puck plugins={plugins} ... />
```

### 2. Define a Field

Use `createStaticAssetField` to add a file upload field to your component config.

```tsx
import { createStaticAssetField } from "@sitemachine/puck-static-assets";

const config = {
  components: {
    Image: {
      fields: {
        image: createStaticAssetField({
          label: "Image",
          accept: ["image/*"], // Optional: restrict file types
        }),
      },
      // ...
    },
  },
};
```

### 3. Render the Asset

Use the `useStaticAssetUrl` hook to resolve the asset URL in your component's render function.

```tsx
import { useStaticAssetUrl } from "@sitemachine/puck-static-assets";

const config = {
  components: {
    Image: {
      // ... fields definition
      render({ image }) {
        const url = useStaticAssetUrl(image?.id);
        if (!url) return null;
        return <img src={url} alt="Static Asset" />;
      },
    },
  },
};
```

### 4. Rendering with Static Assets

To render Puck content with static assets, use the `RenderWithStaticAssets` helper. This component wraps Puck's `Render` and provides the asset map context.

```tsx
import { RenderWithStaticAssets } from "@sitemachine/puck-static-assets";

// Fetch assets and create map
const store = createLocalAssetStore();
const assets = await store.listAssets();
const assetMap = Object.fromEntries(
  assets.map((asset) => [asset.id, asset.url])
);

// Render with assets
<RenderWithStaticAssets 
  data={data} 
  config={config} 
  assets={assetMap} 
/>
```

## Custom Store Example

To store assets on a remote server (e.g., S3, Cloudinary), implement a custom `StaticAssetStore`.

```tsx
import { StaticAssetStore } from "@sitemachine/puck-static-assets";

export const remoteAssetStore: StaticAssetStore = {
  async createAsset(options) {
    const formData = new FormData();
    formData.append("file", options.data.file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    return {
      id: json.id,
      url: json.url,
      name: options.data.name || options.data.file.name,
      size: options.data.file.size,
      mimeType: options.data.file.type,
    };
  },

  async getAsset(options) {
    const res = await fetch(`/api/assets/${options.id}`);
    return res.json();
  },

  async listAssets() {
    const res = await fetch("/api/assets");
    return res.json();
  },

  async deleteAsset(options) {
    await fetch(`/api/assets/${options.id}`, { method: "DELETE" });
    return options.id;
  },

  async updateAsset(options) {
    const res = await fetch(`/api/assets/${options.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.updates),
    });
    return res.json();
  },
};
```

## API

### Exported Components & Helpers

- `createStaticAssetPlugin` - Plugin for Puck editor
- `createStaticAssetField` - Field factory for asset selection
- `RenderWithStaticAssets` - Helper for rendering with assets
- `createLocalAssetStore` - Local IndexedDB store for development

### Exported Hooks

- `useStaticAssetUrl` - Resolve asset ID to URL
- `useCreateStaticAsset` - Create new asset
- `useDeleteStaticAsset` - Delete asset
- `useGetStaticAsset` - Get single asset
- `useListStaticAssets` - List all assets
- `useUpdateStaticAsset` - Update asset

### Exported Types

- `StaticAssetStore` - Interface for custom store implementations
- `StaticAsset` - Asset type definition
- `StaticAssetMap` - Map of asset IDs to URLs
