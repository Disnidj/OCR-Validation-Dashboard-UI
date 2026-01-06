import { X } from 'lucide-react';
import { Document } from '../types';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{document.type}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {document.format === 'pdf' ? (
            <iframe
              src={document.url}
              className="w-full h-full min-h-[600px] border rounded"
              title={document.type}
            />
          ) : (
            <img
              src={document.url}
              alt={document.type}
              className="max-w-full h-auto mx-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
}
