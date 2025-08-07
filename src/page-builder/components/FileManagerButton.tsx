import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
// import { FileManager } from './file-manager'; // TEMPORARILY DISABLED
// import { BasicFileManager } from './file-manager/BasicFileManager';
// import { FlmngrFileManager } from './file-manager/FlmngrFileManager';
import { WorkingFileManager } from './file-manager/WorkingFileManager';

interface FileManagerButtonProps {
  onFileSelect?: (file: { id: string; name: string; url: string; type: string; size: number; uploadedAt: Date; description?: string }) => void;
  className?: string;
}

export const FileManagerButton: React.FC<FileManagerButtonProps> = ({
  onFileSelect,
  className = ''
}) => {
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  
  const handleFileSelect = (file: any) => {
    onFileSelect?.(file);
    setIsFileManagerOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsFileManagerOpen(true)}
        className={className}
        title="Gestor de archivos"
      >
        <ImageIcon size={16} className="sm:hidden" />
        <ImageIcon size={18} className="hidden sm:block" />
      </button>

      {/* Working File Manager - Direct API Integration */}
      <WorkingFileManager
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </>
  );
};
