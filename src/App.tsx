import { FileConversionStepper } from "./components/FileConversionStepper.tsx";
import { Header } from "./components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <FileConversionStepper />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
