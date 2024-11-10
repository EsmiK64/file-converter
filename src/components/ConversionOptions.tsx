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

interface ConversionOptionsProps {
  selectedFile: File | null;
  conversionType: string;
  setConversionType: (type: string) => void;
  scale: number;
  setScale: (scale: number) => void;
}

const CONVERSION_OPTIONS = {
  'application/pdf': [
    { value: 'to-docx', label: 'Convert to Word' },
    { value: 'to-jpg', label: 'Convert to JPG' },
    { value: 'to-png', label: 'Convert to PNG' },
  ],
  'image/svg+xml': [
    { value: 'to-png', label: 'Convert to PNG' },
    { value: 'to-jpg', label: 'Convert to JPG' },
    { value: 'to-webp', label: 'Convert to WebP' },
    { value: 'to-pdf', label: 'Convert to PDF' },
  ],
  'image/jpeg': [
    { value: 'to-png', label: 'Convert to PNG' },
    { value: 'to-webp', label: 'Convert to WebP' },
    { value: 'to-pdf', label: 'Convert to PDF' },
  ],
  'image/png': [
    { value: 'to-jpg', label: 'Convert to JPG' },
    { value: 'to-webp', label: 'Convert to WebP' },
    { value: 'to-pdf', label: 'Convert to PDF' },
  ],
  'image/webp': [
    { value: 'to-jpg', label: 'Convert to JPG' },
    { value: 'to-png', label: 'Convert to PNG' },
    { value: 'to-pdf', label: 'Convert to PDF' },
  ],
};

export function ConversionOptions({ 
  selectedFile, 
  conversionType, 
  setConversionType,
  scale,
  setScale
}: ConversionOptionsProps) {
  const availableConversions = selectedFile 
    ? CONVERSION_OPTIONS[selectedFile.type as keyof typeof CONVERSION_OPTIONS] || []
    : [];

  const showScaleOptions = selectedFile?.type === 'image/svg+xml' && 
    ['to-png', 'to-jpg', 'to-webp'].includes(conversionType);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Convert your file</h2>
          <p className="text-sm text-muted-foreground">
            Select your desired conversion format
          </p>
        </div>
        
        <Select
          value={conversionType}
          onValueChange={setConversionType}
          disabled={!selectedFile}
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