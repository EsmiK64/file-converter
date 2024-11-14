import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FileWithPreview } from "../FileConversionStepper";

interface FileUploadStepProps {
  selectedFiles: FileWithPreview[];
  setSelectedFiles: (files: FileWithPreview[]) => void;
}

export function FileUploadStep({
  selectedFiles,
  setSelectedFiles,
}: FileUploadStepProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      //@ts-ignore
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`);
    },
    [setSelectedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (fileToRemove: FileWithPreview) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    toast.success("File removed");
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
            ${selectedFiles.length > 0 ? "bg-secondary/50" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop your files here"
                  : "Drag & drop your files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to select files
              </p>
            </div>
          </div>
        </div>
      </Card>

      {selectedFiles.length > 0 && (
        <Card className="p-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
