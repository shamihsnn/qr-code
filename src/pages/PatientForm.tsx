
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientInfoForm, { PatientInfoInputs } from '@/components/PatientInfoForm';
import TestDetailsForm from '@/components/TestDetailsForm';
import { TestDetails, PatientData, generatePatientId, savePatientData } from '@/utils/storageUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ClipboardList } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const steps = [
  { id: 'patient-info', label: 'Patient Information', icon: FileText },
  { id: 'test-details', label: 'Test Details', icon: ClipboardList },
];

const PatientForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [patientInfo, setPatientInfo] = useState<PatientInfoInputs | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePatientInfoSubmit = (data: PatientInfoInputs) => {
    setPatientInfo(data);
    setCurrentStep(1);
    
    toast({
      title: "Patient information saved",
      description: "You can now add test details",
    });
  };

  const handleTestDetailsSubmit = (testDetails: TestDetails[]) => {
    if (!patientInfo) return;
    
    const patientId = generatePatientId();
    const patientData: PatientData = {
      id: patientId,
      firstName: patientInfo.firstName,
      lastName: patientInfo.lastName,
      age: patientInfo.age,
      gender: patientInfo.gender,
      contact: patientInfo.contact,
      email: patientInfo.email,
      address: patientInfo.address,
      testDetails,
      createdAt: new Date().toISOString(),
    };
    
    savePatientData(patientData);
    
    toast({
      title: "Report generated",
      description: "Patient record created successfully",
    });
    
    navigate(`/generated-report/${patientId}`);
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-2xl font-bold">MedReport</h1>
            </div>
            
            <nav className="mb-8">
              <ol className="flex items-center">
                {steps.map((step, index) => (
                  <li key={step.id} className="flex items-center">
                    <div 
                      className={`flex items-center justify-center ${
                        index <= currentStep 
                          ? 'text-primary' 
                          : 'text-gray-400'
                      }`}
                    >
                      <div 
                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                          index <= currentStep 
                            ? 'bg-primary/10' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span 
                        className={`font-medium ${
                          index === currentStep 
                            ? 'text-gray-900' 
                            : index < currentStep 
                              ? 'text-gray-700' 
                              : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className="mx-4 h-px w-8 bg-gray-200" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          
          <Card className="glass-panel shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-xl font-medium">
                {currentStep === 0 
                  ? "Patient Information" 
                  : "Test Details"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {currentStep === 0 ? (
                <PatientInfoForm onSubmit={handlePatientInfoSubmit} />
              ) : (
                <TestDetailsForm 
                  onSubmit={handleTestDetailsSubmit} 
                  onBack={handleBack}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
