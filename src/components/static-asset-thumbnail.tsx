import { AspectRatio, Box, Image, Skeleton, Text } from "@chakra-ui/react";
import { LuFile } from "react-icons/lu";
import type { StaticAsset } from "../types/static-asset";
import { useMemo } from "react";
import { isImageMimeType } from "../utils/mime-type-utils";

export function StaticAssetThumbnail({
  asset,
  isLoading,
}: {
  asset: StaticAsset | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Skeleton w={12} h={12} borderRadius="md" />;
  }

  if (!asset) {
    return (
      <Box
        w={12}
        h={12}
        borderWidth={1}
        borderStyle="dashed"
        borderColor="fg.muted"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="fg.muted"
      >
        <LuFile />
      </Box>
    );
  }

  const isImage = useMemo(() => {
    return isImageMimeType(asset.mimeType);
  }, [asset.mimeType]);

  if (isImage && asset.url) {
    return (
      <AspectRatio ratio={1} w={12} borderRadius="md" overflow="hidden">
        <Image
          src={asset.url}
          alt={asset.name ?? "Selected asset"}
          objectFit="cover"
        />
      </AspectRatio>
    );
  }

  return (
    <Box
      w={12}
      h={12}
      borderWidth={1}
      borderColor="fg.muted"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
      px={2}
      textAlign="center"
      color="fg.muted"
    >
      <LuFile />
      <Text fontSize="xs">{asset.name ?? asset.mimeType ?? "File"}</Text>
    </Box>
  );
}
