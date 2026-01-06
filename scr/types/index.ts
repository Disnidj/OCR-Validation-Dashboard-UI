export interface Document {
  id: string;
  type: string;
  format: string;
  url: string;
  thumbnail?: string;
}

export interface VehicleDetails {
  plateCode: string;
  trafficPlateNo: string;
  engineNo: string;
  registerDate: string;
  insuranceExpiry: string;
  vehicleLicenseExpiry: string;
  tcNo: string;
  emptyWeight: string;
  loadingCapacity: string;
  make: string;
  vehicleModel: string;
  modelYear: string;
  noOfSeats: string;
  chassisNo: string;
  origin: string;
}

export interface EmiratesIDData {
  emiratesIdNo: string;
  nationality: string;
  dateOfBirth: string;
  expiryDate: string;
  issueDate: string;
  gender: string;
}

export interface DrivingLicenseData {
  licenseNo: string;
  placeOfIssue: string;
  issueDate: string;
  expiryDate: string;
}

export interface OCRData {
  vehicleDetails: VehicleDetails;
  emiratesId: EmiratesIDData;
  drivingLicense: DrivingLicenseData;
}

export interface PortalIssue {
  id: string;
  portalName: string;
  failureReason: string;
  portalUrl: string;
  username: string;
  password: string;
  completed: boolean;
}

export interface SuccessPortal {
  id: string;
  portalName: string;
  quotationUrl: string;
  quotationFileName: string;
}

export interface FailurePortal {
  id: string;
  portalName: string;
  quotationFile?: File;
  quotationUrl?: string;
}

export interface ComparisonRequest {
  successPortals: SuccessPortal[];
  failurePortals: FailurePortal[];
  recipientEmail: string;
  ccEmails: string[];
  bccEmails: string[];
  message?: string;
}
