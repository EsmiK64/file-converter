import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { converters } from '@/lib/converters';

interface FileConversionZoneProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  conversionType: string;
  scale: number;
}

export function FileConversionZone({ 
  selectedFile, 
  setSelectedFile, 
  conversionType,
  scale
}: FileConversionZoneProps) {
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      toast.success('File uploaded successfully!');
    }
  }, [setSelectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleConvert = async () => {
    if (!selectedFile || !conversionType) {
      toast.error('Please select a file and conversion type');
      return;
    }

    setIsConverting(true);
    setProgress(0);

    const converter = converters[conversionType];
    
    if (!converter) {
      toast.error('Conversion type not supported yet');
      setIsConverting(false);
      return;
    }

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await converter(selectedFile, scale);
      
      clearInterval(progressInterval);
      setProgress(100);
      toast.success('File converted successfully!');
    } catch (error) {
      toast.error('Failed to convert file');
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-8 hover:cursor-pointer">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
            ${selectedFile ? 'bg-secondary/50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {selectedFile ? (
              <>
                <File className="h-12 w-12 text-primary" />
                <div>
                  <p className="text-lg font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to select a file
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {selectedFile && (
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-end">
            <Button 
              size="lg"
              onClick={handleConvert}
              disabled={!conversionType || isConverting}
            >
              {isConverting ? 'Converting...' : 'Convert Now'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}