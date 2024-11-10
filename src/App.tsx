import { useState } from 'react';
import { FileConversionZone } from './components/FileConversionZone';
import { ConversionOptions } from './components/ConversionOptions';
import { Header } from './components/Header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>('');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <ConversionOptions 
              selectedFile={selectedFile}
              conversionType={conversionType}
              setConversionType={setConversionType}
            />
            <FileConversionZone
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              conversionType={conversionType}
            />
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;