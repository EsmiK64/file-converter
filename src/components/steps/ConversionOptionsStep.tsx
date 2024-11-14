import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { FileWithPreview } from "../FileConversionStepper";

interface ConversionOptionsStepProps {
  selectedFiles: FileWithPreview[];
  conversionType: string;
  setConversionType: (type: string) => void;
  scale: number;
  setScale: (scale: number) => void;
}

const CONVERSION_OPTIONS = {
  "application/pdf": [
    { value: "to-docx", label: "Convert to Word (DOCX)" },
    { value: "to-odt", label: "Convert to OpenDocument Text" },
    { value: "to-jpg", label: "Convert to JPG" },
    { value: "to-png", label: "Convert to PNG" },
  ],
  "application/msword": [
    { value: "to-docx", label: "Convert to Word (DOCX)" },
    { value: "to-odt", label: "Convert to OpenDocument Text" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
  "application/vnd.ms-excel": [
    { value: "to-xlsx", label: "Convert to Excel (XLSX)" },
    { value: "to-ods", label: "Convert to OpenDocument Spreadsheet" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
  "application/vnd.ms-powerpoint": [
    { value: "to-pptx", label: "Convert to PowerPoint (PPTX)" },
    { value: "to-odp", label: "Convert to OpenDocument Presentation" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
  "image/svg+xml": [
    { value: "to-png", label: "Convert to PNG" },
    { value: "to-jpg", label: "Convert to JPG" },
    { value: "to-webp", label: "Convert to WebP" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
  "image/jpeg": [
    { value: "to-png", label: "Convert to PNG" },
    { value: "to-webp", label: "Convert to WebP" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
  "image/png": [
    { value: "to-jpg", label: "Convert to JPG" },
    { value: "to-webp", label: "Convert to WebP" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
  "image/webp": [
    { value: "to-jpg", label: "Convert to JPG" },
    { value: "to-png", label: "Convert to PNG" },
    { value: "to-pdf", label: "Convert to PDF" },
  ],
};

export function ConversionOptionsStep({
  selectedFiles,
  conversionType,
  setConversionType,
  scale,
  setScale,
}: ConversionOptionsStepProps) {
  // Get common conversion options available for all selected files
  const availableConversions =
    selectedFiles.length > 0
      ? selectedFiles.reduce((common, file) => {
          const fileOptions =
            CONVERSION_OPTIONS[file.type as keyof typeof CONVERSION_OPTIONS] ||
            [];
          if (common.length === 0) return fileOptions;
          return common.filter((option) =>
            fileOptions.some((fileOption) => fileOption.value === option.value)
          );
        }, [] as { value: string; label: string }[])
      : [];

  const showScaleOptions = selectedFiles.some(
    (file) =>
      file.type === "image/svg+xml" &&
      ["to-png", "to-jpg", "to-webp"].includes(conversionType)
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Convert your files</h2>
          <p className="text-sm text-muted-foreground">
            Select your desired conversion format
          </p>
        </div>

        <Select
          value={conversionType}
          onValueChange={setConversionType}
          disabled={selectedFiles.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select conversion type" />
          </SelectTrigger>
          <SelectContent>
            {availableConversions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showScaleOptions && (
          <div className="space-y-4">
            <Label>Output Scale: {scale}x</Label>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              min={0.5}
              max={64}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
