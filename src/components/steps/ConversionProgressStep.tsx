import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, AlertCircle } from "lucide-react";
import { converters } from "@/lib/converters";
import type { FileWithPreview } from "../FileConversionStepper";

interface ConversionProgressStepProps {
  selectedFiles: FileWithPreview[];
  conversionType: string;
  scale: number;
}

interface FileStatus {
  file: FileWithPreview;
  status: "pending" | "converting" | "completed" | "error";
  progress: number;
}

export function ConversionProgressStep({
  selectedFiles,
  conversionType,
  scale,
}: ConversionProgressStepProps) {
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);

  useEffect(() => {
    setFileStatuses(
      selectedFiles.map((file) => ({
        file,
        status: "pending",
        progress: 0,
      }))
    );
  }, [selectedFiles]);

  useEffect(() => {
    const convertFiles = async () => {
      const converter = converters[conversionType];
      if (!converter) {
        toast.error("Conversion type not supported");
        return;
      }

      for (let i = 0; i < fileStatuses.length; i++) {
        const fileStatus = fileStatuses[i];

        setFileStatuses((prev) =>
          prev.map((status, index) =>
            index === i ? { ...status, status: "converting" } : status
          )
        );

        try {
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setFileStatuses((prev) =>
              prev.map((status, index) =>
                index === i
                  ? {
                      ...status,
                      progress: Math.min(status.progress + 10, 90),
                    }
                  : status
              )
            );
          }, 200);

          await converter(fileStatus.file, scale);

          clearInterval(progressInterval);

          setFileStatuses((prev) =>
            prev.map((status, index) =>
              index === i
                ? {
                    ...status,
                    status: "completed",
                    progress: 100,
                  }
                : status
            )
          );
        } catch (error) {
          console.error("Conversion error:", error);
          setFileStatuses((prev) =>
            prev.map((status, index) =>
              index === i
                ? {
                    ...status,
                    status: "error",
                    progress: 0,
                  }
                : status
            )
          );
        }
      }
    };

    if (conversionType && fileStatuses.length > 0) {
      convertFiles();
    }
  }, [conversionType, fileStatuses.length, scale]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Converting Files</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while your files are being converted
          </p>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {fileStatuses.map((status, index) => (
              <div
                key={`${status.file.name}-${index}`}
                className="p-4 bg-secondary/50 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {status.file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(status.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {status.status === "completed" && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {status.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>

                <Progress value={status.progress} className="h-2" />

                <p className="text-sm text-muted-foreground">
                  {status.status === "pending" && "Waiting..."}
                  {status.status === "converting" && "Converting..."}
                  {status.status === "completed" && "Completed"}
                  {status.status === "error" && "Error converting file"}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
