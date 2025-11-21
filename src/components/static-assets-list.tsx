import {
  Button,
  Center,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useListStaticAssets } from "../hooks/use-list-static-assets";
import { StaticAssetUploadTile } from "./static-asset-upload-tile";
import { useMemo, useState } from "react";
import { StaticAssetTile } from "./static-asset-tile";
import { isMimeTypeMatch } from "../utils/mime-type-utils";

export function StaticAssetsList({
  mimeTypes,
  selectedId,
  onHighlight,
  onSelect,
}: {
  mimeTypes?: string[];
  selectedId: string | null;
  onHighlight: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const [error, setUploadError] = useState<unknown | null>(null);
  const {
    data: assets = [],
    isPending,
    isError,
    refetch,
  } = useListStaticAssets();

  const filteredAssets = useMemo(() => {
    if (!mimeTypes) return assets;
    return assets.filter((e) => isMimeTypeMatch(e.mimeType, mimeTypes));
  }, [assets, mimeTypes]);

  return (
    <>
      {isPending ? (
        <Center h="full">
          <Spinner />
        </Center>
      ) : isError ? (
        <Stack gap={3} alignItems="center" py={8}>
          <Text color="red.500" fontWeight="medium">
            Unable to load assets.
          </Text>
          <Button size="sm" onClick={() => void refetch()}>
            Try again
          </Button>
        </Stack>
      ) : (
        <SimpleGrid columns={{ base: 3, sm: 4, md: 5, lg: 6 }} gap={4}>
          <StaticAssetUploadTile
            accept={mimeTypes}
            onError={(err) => setUploadError(err)}
            onCreated={(id) => {
              onHighlight(id);
              setUploadError(null);
            }}
          />
          {filteredAssets.map((asset) => (
            <StaticAssetTile
              key={asset.id}
              asset={asset}
              isActive={asset.id === selectedId}
              onHighlight={() => onHighlight(asset.id)}
              onSelect={() => onSelect(asset.id)}
              onDeleted={(id) => {
                if (selectedId === id) {
                  onHighlight(null);
                }
              }}
            />
          ))}
        </SimpleGrid>
      )}
      {error && (
        <Text color="fg.warning" fontSize="md" mt={4} textAlign="center">
          {error instanceof Error ? error.message : "Could not upload file"}
        </Text>
      )}
    </>
  );
}
