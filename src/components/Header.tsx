import { FileDown } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileDown className="h-6 w-6" />
            <h1 className="text-2xl font-bold">FileFlow</h1>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}