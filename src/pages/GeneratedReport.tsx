
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import ReportView from '@/components/ReportView';
import { getPatientById, PatientData } from '@/utils/storageUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, FileText, Paperclip, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface AttachmentData {
  file: File | null;
  previewUrl: string | null;
}

const GeneratedReport: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm();
  
  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      const data = getPatientById(patientId);
      
      if (data) {
        setPatient(data);
      } else {
        toast({
          title: "Error",
          description: "Patient record not found",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }
  }, [patientId, toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFile = files[0];
      
      // Generate preview URL for images
      const previewUrl = URL.createObjectURL(newFile);
      
      // Add to attachments
      setAttachments([...attachments, {
        file: newFile,
        previewUrl
      }]);
      
      toast({
        title: "File attached",
        description: `${newFile.name} has been attached to the report`,
      });
      
      // Reset the input
      e.target.value = '';
    }
  };
  
  const removeAttachment = (index: number) => {
    const updatedAttachments = [...attachments];
    
    // Release object URL to prevent memory leaks
    if (updatedAttachments[index].previewUrl) {
      URL.revokeObjectURL(updatedAttachments[index].previewUrl!);
    }
    
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
    
    toast({
      title: "Attachment removed",
      description: "The file has been removed from the report",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full glass-panel">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the patient record you're looking for.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Create report URL for QR Code
  const reportUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <h1 className="text-lg font-medium">MedReport</h1>
              </div>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/patient-form')}
                className="flex items-center gap-2"
              >
                <span>New Report</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 mb-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
            <h1 className="text-2xl font-bold mb-2">Medical Report</h1>
            <p className="text-gray-600">
              Patient ID: <span className="font-medium">{patient.id}</span>
            </p>
          </div>
          
          <Tabs defaultValue="report" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="report" className="text-sm">
                Report View
              </TabsTrigger>
              <TabsTrigger value="attachments" className="text-sm">
                Attachments
              </TabsTrigger>
              <TabsTrigger value="qrcode" className="text-sm">
                QR Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="report" className="mt-0">
              <ReportView patient={patient} />
            </TabsContent>
            
            <TabsContent value="attachments" className="mt-0">
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Attachments</h3>
                    <div className="flex gap-2">
                      <label htmlFor="fileUpload">
                        <Button variant="outline" className="cursor-pointer flex items-center gap-2" asChild>
                          <div>
                            <Paperclip className="h-4 w-4" />
                            <span>Attach File</span>
                          </div>
                        </Button>
                      </label>
                      <label htmlFor="imageUpload">
                        <Button className="cursor-pointer flex items-center gap-2" asChild>
                          <div>
                            <Image className="h-4 w-4" />
                            <span>Add Image</span>
                          </div>
                        </Button>
                      </label>
                    </div>
                  </div>
                  
                  <input 
                    id="fileUpload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  
                  <input 
                    id="imageUpload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  
                  {attachments.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No attachments yet. Add files using the buttons above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {attachments.map((attachment, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4">
                              {attachment.file?.type.startsWith('image/') && attachment.previewUrl ? (
                                <div className="relative">
                                  <img 
                                    src={attachment.previewUrl} 
                                    alt={`Attachment ${index + 1}`} 
                                    className="w-full h-48 object-cover rounded-md"
                                  />
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="absolute top-2 right-2" 
                                    onClick={() => removeAttachment(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                                  <div className="flex items-center">
                                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                    <div>
                                      <p className="font-medium truncate max-w-[200px]">{attachment.file?.name}</p>
                                      <p className="text-xs text-gray-500">{(attachment.file?.size || 0) / 1024 < 1024 ? 
                                        `${Math.round((attachment.file?.size || 0) / 1024)} KB` : 
                                        `${Math.round((attachment.file?.size || 0) / 1024 / 1024 * 10) / 10} MB`}
                                      </p>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => removeAttachment(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qrcode" className="mt-0">
              <div className="flex flex-col items-center justify-center py-8">
                <QRCodeGenerator patientId={patient.id} reportUrl={reportUrl} />
                <p className="text-center mt-8 text-gray-600 max-w-md">
                  Scan this QR code to access the medical report. 
                  Share with the patient for easy access to their test results.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default GeneratedReport;
