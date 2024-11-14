import { useState } from "react";
import { Stepper } from "./Stepper.tsx";
import { FileUploadStep } from "./steps/FileUploadStep.tsx";
import { ConversionOptionsStep } from "./steps/ConversionOptionsStep.tsx";
import { ConversionProgressStep } from "./steps/ConversionProgressStep.tsx";

export type FileWithPreview = File & {
  preview?: string;
};

export function FileConversionStepper() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [conversionType, setConversionType] = useState<string>("");
  const [scale, setScale] = useState(1);

  return (
    <Stepper onComplete={() => console.log("Conversion completed!")}>
      <Stepper.Step title="Upload" description="Select your files" index={0}>
        <FileUploadStep
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </Stepper.Step>

      <Stepper.Step
        title="Options"
        description="Choose conversion options"
        index={1}
      >
        <ConversionOptionsStep
          selectedFiles={selectedFiles}
          conversionType={conversionType}
          setConversionType={setConversionType}
          scale={scale}
          setScale={setScale}
        />
      </Stepper.Step>

      <Stepper.Step title="Convert" description="Process files" index={2}>
        <ConversionProgressStep
          selectedFiles={selectedFiles}
          conversionType={conversionType}
          scale={scale}
        />
      </Stepper.Step>
    </Stepper>
  );
}
