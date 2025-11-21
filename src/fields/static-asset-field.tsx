import type { ReactNode } from "react";
import { useMemo } from "react";
import { FieldLabel, type CustomField } from "@measured/puck";
import {
  Box,
  Button,
  CloseButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { LuFile } from "react-icons/lu";
import { StaticAssetThumbnail } from "../components/static-asset-thumbnail";
import { StaticAssetsDialog } from "../components/static-asset-dialog";
import { useGetStaticAsset } from "../hooks/use-get-static-asset";

export function createStaticAssetField(options: {
  label?: string;
  labelIcon?: ReactNode;
  accept?: string[];
}) {
  return {
    type: "custom",
    metadata: {
      subtype: "asset",
    },
    render({ name, value, onChange }) {
      const disclosure = useDisclosure();

      const selectedAssetQuery = useGetStaticAsset(value?.id);
      const selectedAsset = selectedAssetQuery.data ?? null;
      const isFetchingSelected = selectedAssetQuery.isPending;

      const isPreviewLoading = Boolean(value?.id) && isFetchingSelected;

      const text = useMemo(() => {
        if (selectedAsset) {
          return selectedAsset.name ?? "Selected asset";
        }
        return "Choose asset";
      }, [selectedAsset]);

      return (
        <>
          <FieldLabel
            label={options.label ?? name}
            icon={options.labelIcon ?? <LuFile />}
          >
            <Stack gap={2}>
              <Box
                borderWidth={2}
                borderColor="border"
                borderRadius="md"
                overflow="hidden"
                display="flex"
                alignItems="stretch"
              >
                <Button
                  type="button"
                  variant="ghost"
                  flex={1}
                  justifyContent="flex-start"
                  gap={3}
                  px={3}
                  py={2}
                  h="auto"
                  minH="unset"
                  borderRadius="none"
                  textAlign="left"
                  onClick={() => disclosure.onOpen()}
                >
                  <StaticAssetThumbnail
                    asset={selectedAsset}
                    isLoading={isPreviewLoading}
                  />
                  <Text flex={1} fontWeight="medium" truncate title={text}>
                    {text}
                  </Text>
                </Button>
                {selectedAsset && (
                  <Box
                    borderLeftWidth={1}
                    borderLeftColor="border"
                    display="flex"
                    alignItems="stretch"
                  >
                    <CloseButton
                      size="sm"
                      w={10}
                      h="auto"
                      borderRadius={0}
                      alignSelf="stretch"
                      onClick={(event) => {
                        event.stopPropagation();
                        onChange(null);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </FieldLabel>

          <StaticAssetsDialog
            mimeTypes={options.accept}
            isOpen={disclosure.open}
            onOpen={disclosure.onOpen}
            onClose={disclosure.onClose}
            onSelect={(id) => {
              onChange({ type: "asset", id });
              disclosure.onClose();
            }}
          />
        </>
      );
    },
  } satisfies CustomField<{ type: "asset"; id: string } | null | undefined>;
}
