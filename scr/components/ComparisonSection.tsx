import { useState } from 'react';
import { Upload, FileText, Trash2, Send, Loader, Eye } from 'lucide-react';
import { SuccessPortal, FailurePortal } from '../types';

interface ComparisonSectionProps {
  successPortals: SuccessPortal[];
  failurePortals: FailurePortal[];
  onGenerateComparison: (data: ComparisonData) => Promise<void>;
}

export interface ComparisonData {
  successPortals: SuccessPortal[];
  failurePortals: FailurePortal[];
  recipientEmail: string;
  ccEmails: string[];
  bccEmails: string[];
  message: string;
}

export function ComparisonSection({
  successPortals,
  failurePortals,
  onGenerateComparison,
}: ComparisonSectionProps) {
  const [failureFiles, setFailureFiles] = useState<Record<string, File>>({});
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmails, setCcEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (
    portalId: string,
    file: File | null
  ) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setFailureFiles((prev) => ({ ...prev, [portalId]: file }));
  };

  const removeFile = (portalId: string) => {
    setFailureFiles((prev) => {
      const updated = { ...prev };
      delete updated[portalId];
      return updated;
    });
  };

  const viewDocument = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const parseEmails = (emailString: string): string[] => {
    return emailString
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0 && email.includes('@'));
  };

  const validateEmails = (): boolean => {
    if (!recipientEmail.trim()) {
      setError('Recipient email is required');
      return false;
    }

    if (!recipientEmail.includes('@')) {
      setError('Please enter a valid recipient email');
      return false;
    }

    const ccList = parseEmails(ccEmails);
    const bccList = parseEmails(bccEmails);

    const allEmails = [recipientEmail, ...ccList, ...bccList];
    const validEmails = allEmails.every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (!validEmails) {
      setError('Please enter valid email addresses');
      return false;
    }

    return true;
  };

  const handleGenerateComparison = async () => {
    setError('');

    if (!validateEmails()) {
      return;
    }

    if (Object.keys(failureFiles).length === 0) {
      setError('Please upload at least one quotation file for failed scenarios');
      return;
    }

    setLoading(true);

    const updatedFailure = failurePortals.map((portal) => ({
      ...portal,
      quotationFile: failureFiles[portal.id],
    }));

    try {
      await onGenerateComparison({
        successPortals: successPortals,
        failurePortals: updatedFailure,
        recipientEmail: recipientEmail.trim(),
        ccEmails: parseEmails(ccEmails),
        bccEmails: parseEmails(bccEmails),
        message: message.trim(),
      });

      setRecipientEmail('');
      setCcEmails('');
      setBccEmails('');
      setMessage('');
      setFailureFiles({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate comparison');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Comparison</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Success Scenarios
          </h3>

          <div className="space-y-4">
            {successPortals.map((portal) => (
              <div
                key={portal.id}
                className="border-2 border-green-200 rounded-lg p-4 bg-green-50"
              >
                <p className="font-medium text-gray-900 mb-3">{portal.portalName}</p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded border border-green-300">
                    <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      {portal.quotationFileName}
                    </span>
                    <button
                      onClick={() => viewDocument(portal.quotationUrl)}
                      className="ml-auto p-1 hover:bg-green-100 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            Failed Scenarios
          </h3>

          <div className="space-y-4">
            {failurePortals.map((portal) => (
              <div
                key={portal.id}
                className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50"
              >
                <p className="font-medium text-gray-900 mb-3">{portal.portalName}</p>

                <div className="flex items-center gap-2">
                  {failureFiles[portal.id] ? (
                    <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded border border-orange-300">
                      <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {failureFiles[portal.id].name}
                      </span>
                      <button
                        onClick={() => removeFile(portal.id)}
                        className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-100 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">Upload PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          handleFileUpload(portal.id, e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Recipients</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CC Emails (comma separated)
            </label>
            <input
              type="text"
              value={ccEmails}
              onChange={(e) => setCcEmails(e.target.value)}
              placeholder="cc1@example.com, cc2@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BCC Emails (comma separated)
            </label>
            <input
              type="text"
              value={bccEmails}
              onChange={(e) => setBccEmails(e.target.value)}
              placeholder="bcc1@example.com, bcc2@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a custom message to include in the email..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerateComparison}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Generating & Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Generate Comparison & Send Email
          </>
        )}
      </button>
    </section>
  );
}
