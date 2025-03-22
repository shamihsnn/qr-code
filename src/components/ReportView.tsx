
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { PatientData } from '@/utils/storageUtils';
import { generateReportHTML, generateReportCSS } from '@/utils/reportGenerator';

interface ReportViewProps {
  patient: PatientData;
  onBack?: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ patient, onBack }) => {
  const reportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reportContainerRef.current) {
      const reportHTML = generateReportHTML(patient);
      const reportCSS = generateReportCSS();
      
      const reportContent = `
        <style>${reportCSS}</style>
        ${reportHTML}
      `;
      
      reportContainerRef.current.innerHTML = reportContent;
    }
  }, [patient]);

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const reportHTML = generateReportHTML(patient);
      const reportCSS = generateReportCSS();
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Medical Report - ${patient.firstName} ${patient.lastName}</title>
            <style>${reportCSS}</style>
          </head>
          <body>
            ${reportHTML}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const downloadReport = () => {
    const reportHTML = generateReportHTML(patient);
    const reportCSS = generateReportCSS();
    
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Report - ${patient.firstName} ${patient.lastName}</title>
          <style>${reportCSS}</style>
        </head>
        <body>
          ${reportHTML}
        </body>
      </html>
    `;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${patient.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={printReport}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Print</span>
          </Button>
          
          <Button
            onClick={downloadReport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </div>
      
      <Card className="glass-panel shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={reportContainerRef}
            className="print:shadow-none overflow-auto max-h-[calc(100vh-200px)]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportView;
