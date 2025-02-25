import { promises as fs } from 'fs';
import path from 'path';
import { workspaceServers } from '../config/workspace-servers';
import { logger } from '../utils/logger';

interface ComponentSetup {
  name: string;
  content: string;
}

async function preparePropertyViewerComponents(workspaceId: string) {
  const componentsPath = path.join(
    workspaceServers.baseServerPath,
    workspaceId,
    workspaceServers.workspaceStructure.componentsDir
  );

  // Define required components
  const components: ComponentSetup[] = [
    {
      name: 'PropertyDocumentViewer.tsx',
      content: `import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import Image from 'next/image';

interface DocumentViewerProps {
  files: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'image';
    url: string;
  }>;
}

export const PropertyDocumentViewer: React.FC<DocumentViewerProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* File List */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold">Files</h2>
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={\`px-4 py-2 rounded \${
                selectedFile.id === file.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }\`}
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>

      {/* Viewer */}
      <div className="border rounded-lg p-4">
        {selectedFile.type === 'pdf' ? (
          <div>
            <Document
              file={selectedFile.url}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {numPages && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-96">
            <Image
              src={selectedFile.url}
              alt={selectedFile.name}
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
      </div>

      {/* Download Button */}
      <button
        onClick={() => window.open(selectedFile.url, '_blank')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Download File
      </button>
    </div>
  );
};`
    },
    {
      name: 'useFileSearch.ts',
      content: `import { useState, useCallback } from 'react';

interface FileSearchHook {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredFiles: File[];
}

interface File {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
}

export const useFileSearch = (files: File[]): FileSearchHook => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredFiles,
  };
};`
    },
    {
      name: 'FileGallery.tsx',
      content: `import React from 'react';
import Image from 'next/image';

interface FileGalleryProps {
  files: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'image';
    url: string;
    thumbnail?: string;
  }>;
  onFileSelect: (file: any) => void;
}

export const FileGallery: React.FC<FileGalleryProps> = ({
  files,
  onFileSelect,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onFileSelect(file)}
          className="cursor-pointer group"
        >
          <div className="relative aspect-square border rounded-lg overflow-hidden group-hover:border-blue-500">
            {file.type === 'image' ? (
              <Image
                src={file.thumbnail || file.url}
                alt={file.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600 truncate">{file.name}</p>
        </div>
      ))}
    </div>
  );
};`
    }
  ];

  // Create components
  for (const component of components) {
    const componentPath = path.join(componentsPath, component.name);
    await fs.writeFile(componentPath, component.content);
    logger.info(`Created component: ${component.name}`);
  }

  // Create package.json with required dependencies
  const packageJson = {
    dependencies: {
      'react-pdf': '^6.2.0',
      'next': '^14.1.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      '@types/react': '^18.2.57',
      '@types/react-dom': '^18.2.19',
      'tailwindcss': '^3.4.1',
      'typescript': '^5.3.3'
    }
  };

  await fs.writeFile(
    path.join(componentsPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  logger.info('Created package.json with required dependencies');

  // Create README with component usage instructions
  const readmeContent = `# Property Document Viewer Components

## Components Overview
1. \`PropertyDocumentViewer.tsx\`: Main component for viewing PDF and image files
2. \`useFileSearch.ts\`: Custom hook for file search functionality
3. \`FileGallery.tsx\`: Grid view component for displaying file thumbnails

## Setup Instructions
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Import and use components:
   \`\`\`typescript
   import { PropertyDocumentViewer } from './PropertyDocumentViewer';
   import { useFileSearch } from './useFileSearch';
   import { FileGallery } from './FileGallery';

   // Example usage
   const files = [
     {
       id: '1',
       name: 'document.pdf',
       type: 'pdf',
       url: '/documents/document.pdf'
     }
   ];

   function App() {
     return <PropertyDocumentViewer files={files} />;
   }
   \`\`\`

## Features
- PDF viewer with page navigation
- Image gallery with thumbnails
- File search functionality
- Download capability
- Responsive design

## Testing
Ensure to test the following scenarios:
1. PDF viewing and navigation
2. Image display
3. File search functionality
4. Download feature
5. Responsive layout on different screen sizes`;

  await fs.writeFile(
    path.join(componentsPath, 'README.md'),
    readmeContent
  );
  logger.info('Created component documentation');
}

export { preparePropertyViewerComponents }; 