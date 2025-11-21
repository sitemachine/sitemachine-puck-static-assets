import { Button, HStack } from "@chakra-ui/react";

export function StaticAssetsFooter({
  canSelect,
  onSelect,
  onClose,
}: {
  canSelect: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  return (
    <HStack w="full" justifyContent="flex-end" gap={2}>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button
        colorPalette="blue"
        onClick={() => onSelect()}
        disabled={!canSelect}
      >
        Select
      </Button>
    </HStack>
  );
}
