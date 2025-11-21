import {
  FileUpload as ChakraFileUpload,
  IconButton,
  Span,
  Text,
  useFileUploadContext,
  useRecipe,
} from "@chakra-ui/react";
import * as React from "react";
import { LuFile, LuTrash2, LuUpload } from "react-icons/lu";

export interface FileUploadRootProps extends ChakraFileUpload.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FileUploadRoot = React.forwardRef<
  HTMLDivElement,
  FileUploadRootProps
>(function FileUploadRoot(props, ref) {
  const { children, inputProps, ...rest } = props;
  return (
    <ChakraFileUpload.Root ref={ref} {...rest}>
      <ChakraFileUpload.HiddenInput {...inputProps} />
      {children}
    </ChakraFileUpload.Root>
  );
});

export interface FileUploadDropzoneProps
  extends ChakraFileUpload.DropzoneProps {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const FileUploadDropzone = React.forwardRef<
  HTMLDivElement,
  FileUploadDropzoneProps
>(function FileUploadDropzone(props, ref) {
  const { children, label, description, ...rest } = props;
  return (
    <ChakraFileUpload.Dropzone ref={ref} {...rest}>
      <ChakraFileUpload.DropzoneContent>
        <LuUpload />
        <div>{label}</div>
        {description && <Text color="fg.muted">{description}</Text>}
      </ChakraFileUpload.DropzoneContent>
      {children}
    </ChakraFileUpload.Dropzone>
  );
});

interface VisibilityProps {
  showSize?: boolean;
  clearable?: boolean;
}

interface FileUploadItemProps extends VisibilityProps {
  file: File;
}

const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  function FileUploadItem(props, ref) {
    const { file, showSize, clearable } = props;
    return (
      <ChakraFileUpload.Item file={file} ref={ref}>
        <ChakraFileUpload.ItemPreview asChild>
          <LuFile />
        </ChakraFileUpload.ItemPreview>

        {/* <ChakraFileUpload.ItemName /> */}
        <ChakraFileUpload.ItemName flex="1" />

        {showSize && <ChakraFileUpload.ItemSizeText />}
        {clearable && (
          <ChakraFileUpload.ItemDeleteTrigger asChild>
            <IconButton variant="ghost" color="fg.muted" size="xs">
              <LuTrash2 />
            </IconButton>
          </ChakraFileUpload.ItemDeleteTrigger>
        )}
      </ChakraFileUpload.Item>
    );
  },
);

interface FileUploadListProps
  extends ChakraFileUpload.ItemGroupProps,
    VisibilityProps {}

export const FileUploadList = React.forwardRef<
  HTMLUListElement,
  FileUploadListProps
>(function FileUploadList(props, ref) {
  const { showSize, clearable, ...rest } = props;
  return (
    <ChakraFileUpload.ItemGroup ref={ref} {...rest}>
      <ChakraFileUpload.Context>
        {({ acceptedFiles }) => {
          if (acceptedFiles.length === 0) return null;
          return acceptedFiles.map((file) => (
            <FileUploadItem
              key={file.name}
              file={file}
              showSize={showSize}
              clearable={clearable}
            />
          ));
        }}
      </ChakraFileUpload.Context>
    </ChakraFileUpload.ItemGroup>
  );
});

export const FileUploadLabel = ChakraFileUpload.Label;
export const FileUploadTrigger = ChakraFileUpload.Trigger;
