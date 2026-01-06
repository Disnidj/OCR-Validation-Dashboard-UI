import { useState } from 'react';
import { FileText, Image as ImageIcon, File, Eye } from 'lucide-react';
import { Document } from '../types';
import { DocumentViewer } from './DocumentViewer';

interface DocumentsSectionProps {
  documents: Document[];
}

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const getDocumentIcon = (format: string) => {
    if (format === 'pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (format === 'image') return <ImageIcon className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {doc.thumbnail ? (
                  <img
                    src={doc.thumbnail}
                    alt={doc.type}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    {getDocumentIcon(doc.format)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{doc.type}</h3>
                <p className="text-sm text-gray-500 uppercase mt-1">{doc.format}</p>

                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </section>
  );
}
