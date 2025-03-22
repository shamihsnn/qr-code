
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, UserPlus, QrCode, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-medium">MedReport</h1>
          </div>
          
          <Button onClick={() => navigate('/patient-form')} className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>New Patient</span>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container px-4 mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Medical Report Generator</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Streamlined Medical Reports for Patients</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Generate professional medical reports, create QR codes, and provide easy access to patient results.
            </p>
            <Button 
              onClick={() => navigate('/patient-form')}
              size="lg"
              className="px-8 py-6 text-base"
            >
              Get Started
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="animate-slide-in [animation-delay:100ms] glass-panel hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Patient Information</h3>
                <p className="text-gray-600 mb-4">
                  Collect patient details and medical test information through a simple, intuitive form.
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-in [animation-delay:200ms] glass-panel hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">QR Code Generation</h3>
                <p className="text-gray-600 mb-4">
                  Generate unique QR codes for each report, making it easy for patients to access their results.
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-in [animation-delay:300ms] glass-panel hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Professional Reports</h3>
                <p className="text-gray-600 mb-4">
                  Create beautifully formatted, detailed medical reports that can be printed or downloaded.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="rounded-2xl overflow-hidden glass-panel shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Create Your First Report?
                </h2>
                <p className="text-gray-600 mb-6">
                  Start by entering patient information and test details, and we'll generate a professional report with a unique QR code.
                </p>
                <div>
                  <Button 
                    onClick={() => navigate('/patient-form')}
                    className="flex items-center gap-2"
                  >
                    <span>Create New Report</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/80 to-primary p-8 md:p-12 text-white flex flex-col justify-center">
                <h3 className="text-xl font-medium mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Easy-to-use patient information forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Detailed test result tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Unique patient ID generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>QR code generation for easy access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Professionally formatted reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600 font-medium">MedReport</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MedReport. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
