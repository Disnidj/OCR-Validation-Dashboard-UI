import { useState } from 'react';
import { ExternalLink, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { PortalIssue } from '../types';

interface PortalSectionProps {
  portals: PortalIssue[];
  onMarkCompleted: (portalId: string) => void;
}

export function PortalSection({ portals, onMarkCompleted }: PortalSectionProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (portalId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [portalId]: !prev[portalId] }));
  };

  const handleGoToPortal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          Portal Issues & Manual Completion
        </h2>
      </div>

      <div className="space-y-4">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className={`border rounded-lg p-5 transition-all ${
              portal.completed
                ? 'border-green-300 bg-green-50'
                : 'border-orange-300 bg-orange-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {portal.portalName}
                  </h3>
                  {portal.completed && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Failure Reason:</p>
                  <p className="text-sm text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
                    {portal.failureReason}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={portal.username}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={visiblePasswords[portal.id] ? 'text' : 'password'}
                    value={portal.password}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 pr-10"
                  />
                  <button
                    onClick={() => togglePasswordVisibility(portal.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    {visiblePasswords[portal.id] ? (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleGoToPortal(portal.portalUrl)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Go to Portal
              </button>

              {!portal.completed && (
                <button
                  onClick={() => onMarkCompleted(portal.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}

        {portals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="text-lg font-medium">No portal issues found</p>
            <p className="text-sm mt-1">All portals processed successfully</p>
          </div>
        )}
      </div>
    </section>
  );
}
