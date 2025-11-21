import { useState } from "react";
import { Portal, Dialog, CloseButton } from "@chakra-ui/react";
import { StaticAssetsList } from "./static-assets-list";
import { StaticAssetsFooter } from "./static-assets-footer";

export function StaticAssetsDialog({
  mimeTypes,
  isOpen,
  onOpen,
  onClose,
  onSelect,
}: {
  mimeTypes?: string[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  return (
    <Dialog.Root
      id="static-assets-dialog"
      size={{ mdDown: "full", md: "cover" }}
      placement="center"
      open={isOpen}
      onOpenChange={(event) => {
        if (event.open) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="md" />
            </Dialog.CloseTrigger>
            <Dialog.Header borderBottomWidth={1}>
              <Dialog.Title>Static Assets</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <StaticAssetsList
                selectedId={highlightedId}
                onHighlight={setHighlightedId}
                mimeTypes={mimeTypes}
                onSelect={(id) => {
                  setHighlightedId(id);
                  onSelect(id);
                }}
              />
            </Dialog.Body>
            <Dialog.Footer borderTopWidth={1}>
              <StaticAssetsFooter
                canSelect={!!highlightedId}
                onClose={onClose}
                onSelect={() => {
                  if (highlightedId) {
                    onSelect(highlightedId);
                  }
                }}
              />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
