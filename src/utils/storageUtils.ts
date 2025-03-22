export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  testDetails: TestDetails[];
  createdAt: string;
}

export interface TestDetails {
  testName: string;
  testType: string;
  testDate: string;
  testResult: string;
  normalRange?: string;
  notes?: string;
  attachments?: TestAttachment[];
}

export interface TestAttachment {
  name: string;
  type: string;
  dataUrl: string;
}

// Generate a unique patient ID
export const generatePatientId = (): string => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MR-${timestamp.substring(timestamp.length - 4)}-${randomStr}`;
};

// Store patient data in localStorage
export const savePatientData = (patient: PatientData): void => {
  try {
    // Get existing patients or initialize an empty array
    const existingData = localStorage.getItem('patients');
    const patients: PatientData[] = existingData ? JSON.parse(existingData) : [];
    
    // Add new patient
    patients.push(patient);
    
    // Save back to localStorage
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Also save separately by ID for quick lookup
    localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
  } catch (error) {
    console.error('Error saving patient data:', error);
  }
};

// Get patient data by ID
export const getPatientById = (id: string): PatientData | null => {
  try {
    const data = localStorage.getItem(`patient_${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving patient data:', error);
    return null;
  }
};

// Get all patients
export const getAllPatients = (): PatientData[] => {
  try {
    const data = localStorage.getItem('patients');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving all patients:', error);
    return [];
  }
};
