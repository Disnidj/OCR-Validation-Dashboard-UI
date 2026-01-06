import { useState } from 'react';
import { Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { OCRData } from '../types';

interface OCRDataSectionProps {
  initialData: OCRData;
  onSave: (data: OCRData) => void;
}

export function OCRDataSection({ initialData, onSave }: OCRDataSectionProps) {
  const [data, setData] = useState<OCRData>(initialData);
  const [expandedSections, setExpandedSections] = useState({
    vehicle: true,
    emirates: true,
    license: true,
  });

  const handleReset = () => {
    setData(initialData);
  };

  const handleSave = () => {
    onSave(data);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateVehicleField = (field: keyof typeof data.vehicleDetails, value: string) => {
    setData((prev) => ({
      ...prev,
      vehicleDetails: { ...prev.vehicleDetails, [field]: value },
    }));
  };

  const updateEmiratesField = (field: keyof typeof data.emiratesId, value: string) => {
    setData((prev) => ({
      ...prev,
      emiratesId: { ...prev.emiratesId, [field]: value },
    }));
  };

  const updateLicenseField = (field: keyof typeof data.drivingLicense, value: string) => {
    setData((prev) => ({
      ...prev,
      drivingLicense: { ...prev.drivingLicense, [field]: value },
    }));
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">OCR Extracted Data (Editable)</h2>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('vehicle')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Details</h3>
            {expandedSections.vehicle ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandedSections.vehicle && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plate Code
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.plateCode}
                  onChange={(e) => updateVehicleField('plateCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Traffic Plate No
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.trafficPlateNo}
                  onChange={(e) => updateVehicleField('trafficPlateNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine No
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.engineNo}
                  onChange={(e) => updateVehicleField('engineNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Register Date
                </label>
                <input
                  type="date"
                  value={data.vehicleDetails.registerDate}
                  onChange={(e) => updateVehicleField('registerDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  value={data.vehicleDetails.insuranceExpiry}
                  onChange={(e) => updateVehicleField('insuranceExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle License Expiry
                </label>
                <input
                  type="date"
                  value={data.vehicleDetails.vehicleLicenseExpiry}
                  onChange={(e) => updateVehicleField('vehicleLicenseExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  T.C No
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.tcNo}
                  onChange={(e) => updateVehicleField('tcNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empty Weight
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.emptyWeight}
                  onChange={(e) => updateVehicleField('emptyWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loading Capacity
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.loadingCapacity}
                  onChange={(e) => updateVehicleField('loadingCapacity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.make}
                  onChange={(e) => updateVehicleField('make', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.vehicleModel}
                  onChange={(e) => updateVehicleField('vehicleModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Year
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.modelYear}
                  onChange={(e) => updateVehicleField('modelYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. of Seats
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.noOfSeats}
                  onChange={(e) => updateVehicleField('noOfSeats', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chassis No
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.chassisNo}
                  onChange={(e) => updateVehicleField('chassisNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  value={data.vehicleDetails.origin}
                  onChange={(e) => updateVehicleField('origin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('emirates')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Emirates ID</h3>
            {expandedSections.emirates ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandedSections.emirates && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emirates ID Number
                </label>
                <input
                  type="text"
                  value={data.emiratesId.emiratesIdNo}
                  onChange={(e) => updateEmiratesField('emiratesIdNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={data.emiratesId.nationality}
                  onChange={(e) => updateEmiratesField('nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={data.emiratesId.dateOfBirth}
                  onChange={(e) => updateEmiratesField('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={data.emiratesId.expiryDate}
                  onChange={(e) => updateEmiratesField('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={data.emiratesId.issueDate}
                  onChange={(e) => updateEmiratesField('issueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={data.emiratesId.gender}
                  onChange={(e) => updateEmiratesField('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('license')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Driving License</h3>
            {expandedSections.license ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandedSections.license && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License No
                </label>
                <input
                  type="text"
                  value={data.drivingLicense.licenseNo}
                  onChange={(e) => updateLicenseField('licenseNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place of Issue
                </label>
                <input
                  type="text"
                  value={data.drivingLicense.placeOfIssue}
                  onChange={(e) => updateLicenseField('placeOfIssue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={data.drivingLicense.issueDate}
                  onChange={(e) => updateLicenseField('issueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={data.drivingLicense.expiryDate}
                  onChange={(e) => updateLicenseField('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
