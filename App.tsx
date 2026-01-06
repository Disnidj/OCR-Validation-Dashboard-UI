import { useState } from 'react';
import { DocumentsSection } from './scr/components/DocumentsSection';
import { OCRDataSection } from './scr/components/OCRDataSection';
import { PortalSection } from './scr/components/PortalSection';
import { ComparisonSection, ComparisonData } from './scr/components/ComparisonSection';
import { Document, OCRData, PortalIssue, SuccessPortal, FailurePortal } from './scr/types';
import { FileText } from 'lucide-react';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'Emirates ID',
    format: 'image',
    url: 'https://images.pexels.com/photos/6804082/pexels-photo-6804082.jpeg?auto=compress&cs=tinysrgb&w=400',
    thumbnail: 'https://images.pexels.com/photos/6804082/pexels-photo-6804082.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    type: 'Driving License',
    format: 'image',
    url: 'https://images.pexels.com/photos/4965840/pexels-photo-4965840.jpeg?auto=compress&cs=tinysrgb&w=400',
    thumbnail: 'https://images.pexels.com/photos/4965840/pexels-photo-4965840.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    type: 'VLC / Mulkia Front',
    format: 'image',
    url: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400',
    thumbnail: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '4',
    type: 'Mulkia Back',
    format: 'image',
    url: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=400',
    thumbnail: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

const initialOCRData: OCRData = {
  vehicleDetails: {
    plateCode: 'DXB',
    trafficPlateNo: 'A12345',
    engineNo: 'ENG123456789',
    registerDate: '2020-01-15',
    insuranceExpiry: '2025-12-31',
    vehicleLicenseExpiry: '2025-12-31',
    tcNo: 'TC987654',
    emptyWeight: '1500 kg',
    loadingCapacity: '500 kg',
    make: 'Toyota',
    vehicleModel: 'Camry',
    modelYear: '2020',
    noOfSeats: '5',
    chassisNo: 'CH123456789ABCDEF',
    origin: 'Japan',
  },
  emiratesId: {
    emiratesIdNo: '784-1234-5678901-2',
    nationality: 'United Arab Emirates',
    dateOfBirth: '1990-05-15',
    expiryDate: '2027-05-14',
    issueDate: '2017-05-15',
    gender: 'Male',
  },
  drivingLicense: {
    licenseNo: 'DL123456789',
    placeOfIssue: 'Dubai',
    issueDate: '2018-03-20',
    expiryDate: '2028-03-19',
  },
};

const mockPortalIssues: PortalIssue[] = [
  {
    id: '1',
    portalName: 'Tokio Marine Portal',
    failureReason: 'Session timeout during data submission. The portal requires re-authentication.',
    portalUrl: 'https://example.com/tokio',
    username: 'tokio_user_123',
    password: 'SecurePass123!',
    completed: false,
  },
  {
    id: '2',
    portalName: 'Sukoon Insurance Portal',
    failureReason: 'CAPTCHA verification failed after multiple attempts.',
    portalUrl: 'https://example.com/sukoon',
    username: 'sukoon_admin',
    password: 'AdminPass456#',
    completed: false,
  },
];

const mockSuccessPortals: SuccessPortal[] = [
  {
    id: 'success-1',
    portalName: 'Portal A',
    quotationUrl: 'https://images.pexels.com/photos/4065623/pexels-photo-4065623.jpeg?auto=compress&cs=tinysrgb&w=600',
    quotationFileName: 'Portal_A_Quotation.pdf',
  },
  {
    id: 'success-2',
    portalName: 'Portal B',
    quotationUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600',
    quotationFileName: 'Portal_B_Quotation.pdf',
  },
];

const mockFailurePortals: FailurePortal[] = [
  {
    id: 'failure-1',
    portalName: 'Sukoon Insurance Portal',
  },
  {
    id: 'failure-2',
    portalName: 'Tokio Marine Portal',
  },
];

function App() {
  console.log('App component rendering...');
  
  const [ocrData] = useState<OCRData>(initialOCRData);
  const [portalIssues, setPortalIssues] = useState<PortalIssue[]>(mockPortalIssues);
  const [successPortals] = useState<SuccessPortal[]>(mockSuccessPortals);
  const [failurePortals] = useState<FailurePortal[]>(mockFailurePortals);

  console.log('App state initialized');

  const handleSaveOCRData = (data: OCRData) => {
    console.log('Saving OCR data:', data);
  };

  const handleMarkCompleted = (portalId: string) => {
    setPortalIssues((prev) =>
      prev.map((portal) =>
        portal.id === portalId ? { ...portal, completed: true } : portal
      )
    );
  };

  const handleGenerateComparison = async (data: ComparisonData) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const successFileData = data.successPortals.map((p) => ({
        portalName: p.portalName,
        fileName: p.quotationFileName,
        fileUrl: p.quotationUrl,
      }));

      const failureFileData = await Promise.all(
        data.failurePortals
          .filter((p) => p.quotationFile)
          .map(async (p) => ({
            portalName: p.portalName,
            fileData: await fileToBase64(p.quotationFile!),
          }))
      );

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-comparison`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            recipientEmail: data.recipientEmail,
            ccEmails: data.ccEmails,
            bccEmails: data.bccEmails,
            message: data.message,
            successQuotations: successFileData,
            failureQuotations: failureFileData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate comparison');
      }

      alert('Comparison generated and email sent successfully!');
    } catch (error) {
      throw error instanceof Error ? error : new Error('An error occurred');
    }
  };

  console.log('App about to return JSX');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">OCR Validation Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DocumentsSection documents={mockDocuments} />
        <OCRDataSection initialData={ocrData} onSave={handleSaveOCRData} />
        <PortalSection portals={portalIssues} onMarkCompleted={handleMarkCompleted} />
        <ComparisonSection
          successPortals={successPortals}
          failurePortals={failurePortals}
          onGenerateComparison={handleGenerateComparison}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          OCR Validation Dashboard - Manage documents, validate OCR data, and resolve portal issues
        </div>
      </footer>
    </div>
  );
}

export default App;
