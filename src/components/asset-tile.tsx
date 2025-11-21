import {
  AspectRatio,
  Box,
  IconButton,
  Image,
  Menu,
  Text,
  Button,
  DownloadTrigger,
} from "@chakra-ui/react";
import {
  LuFile,
  LuEllipsisVertical,
  LuTrash,
  LuDownload,
} from "react-icons/lu";
import type { StaticAsset } from "../types/static-asset";
import { isImageMimeType } from "../utils/mime-type-utils";
import { useMemo } from "react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function AssetTile({
  asset,
  isActive,
  onSelect,
  onDelete,
}: {
  asset: StaticAsset;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const isImage = useMemo(() => {
    return isImageMimeType(asset.mimeType);
  }, [asset.mimeType]);
  return (
    <Box
      borderWidth={2}
      borderColor={isActive ? "blue.500" : undefined}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={onSelect}
      transition="border-color 0.2s, box-shadow 0.2s"
      boxShadow={isActive ? "outline" : undefined}
      _hover={{ borderColor: "blue.500" }}
      position="relative"
      className="group"
    >
      <Box
        position="absolute"
        top={2}
        right={2}
        zIndex={2}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
        onClick={(e) => e.stopPropagation()}
      >
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton
              size="xs"
              variant="outline"
              rounded="full"
              bg="rgba(0, 0, 0, 0.6)"
              color="white"
              _hover={{ bg: "rgba(0, 0, 0, 0.8)" }}
            >
              <LuEllipsisVertical />
            </IconButton>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <DownloadMenuItem asset={asset} />
              <DeleteMenuItem onDelete={onDelete} />
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Box>
      <AspectRatio ratio={4 / 3}>
        {isImage && asset.url ? (
          <Image
            src={asset.url}
            alt={asset.name ?? "Asset preview"}
            objectFit="cover"
          />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bg="bg.muted"
            color="fg.muted"
            gap={1}
            p={4}
            textAlign="center"
          >
            <LuFile />
            <Text fontSize="sm" fontWeight="medium">
              {asset.name ?? "File"}
            </Text>
            <Text fontSize="xs">{asset.mimeType ?? "Unknown type"}</Text>
          </Box>
        )}
      </AspectRatio>
      <Box p={3} borderTopWidth={1}>
        <Text fontWeight="medium" truncate>
          {asset.name ?? "Untitled asset"}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          {formatBytes(asset.size)}
        </Text>
      </Box>
    </Box>
  );
}

// --- Menu Item Components ---

function DownloadMenuItem({ asset }: { asset: StaticAsset }) {
  return (
    <Menu.Item value="download" asChild>
      <DownloadTrigger
        data={asset.url}
        fileName={asset.name ?? "download"}
        mimeType={asset.mimeType}
      >
        <LuDownload /> Download
      </DownloadTrigger>
    </Menu.Item>
  );
}

function DeleteMenuItem({ onDelete }: { onDelete: () => void }) {
  return (
    <Menu.Item value="delete" color="fg.error" onClick={onDelete}>
      <LuTrash />
      Delete
    </Menu.Item>
  );
}
