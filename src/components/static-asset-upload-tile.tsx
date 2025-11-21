import { Box, Text } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { FileUploadRoot, FileUploadTrigger } from "./ui/file-upload";
import { useCreateStaticAsset } from "../hooks/use-create-static-asset";

export function StaticAssetUploadTile({
  onCreated,
  onError,
  accept,
}: {
  onCreated?: (assetId: string) => void;
  onError?: (error: unknown) => void;
  accept?: string[];
}) {
  const createMutation = useCreateStaticAsset();

  const handleFileAccept = async (details: { files: File[] }) => {
    const file = details.files[0];
    if (!file) return;
    try {
      const created = await createMutation.mutateAsync({ data: { file } });
      onCreated?.(created.id);
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <FileUploadRoot maxFiles={1} onFileAccept={handleFileAccept} h="full" accept={accept}>
      <FileUploadTrigger asChild>
        <Box
          as="button"
          w="full"
          h="full"
          minH="150px"
          borderWidth={2}
          borderStyle="dashed"
          borderRadius="lg"
          borderColor="border"
          cursor="pointer"
          _hover={{ borderColor: "blue.500", bg: "bg.subtle", color: "fg" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          color="fg.muted"
          transition="all 0.2s"
          _disabled={
            createMutation.isPending
              ? { opacity: 0.5, cursor: "not-allowed" }
              : {}
          }
        >
          <LuPlus size="2em" />
          <Text fontWeight="medium">Upload</Text>
        </Box>
      </FileUploadTrigger>
    </FileUploadRoot>
  );
}
