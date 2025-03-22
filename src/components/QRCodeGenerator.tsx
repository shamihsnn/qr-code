
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface QRCodeGeneratorProps {
  patientId: string;
  reportUrl: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ patientId, reportUrl }) => {
  const [qrCodeSrc, setQrCodeSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        // Using the QR Code API to generate QR code
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(reportUrl)}&size=200x200&margin=20`;
        setQrCodeSrc(qrCodeUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (reportUrl) {
      generateQRCode();
    }
  }, [reportUrl]);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeSrc;
    link.download = `medical-report-qr-${patientId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Medical Report QR Code - ${patientId}`,
          text: 'Scan this QR code to view your medical report',
          url: reportUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(reportUrl);
      alert('Report URL copied to clipboard!');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden glass-panel animate-fade-in">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Patient QR Code</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Scan this code to view the medical report
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          {isLoading ? (
            <div className="w-48 h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-sm text-gray-400">Generating...</span>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <img 
                src={qrCodeSrc} 
                alt={`QR Code for patient ${patientId}`} 
                className="w-48 h-48 object-contain"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground mb-6">
          <p className="font-medium">Patient ID: {patientId}</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={downloadQRCode} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Download</span>
          </Button>
          
          <Button 
            onClick={shareQRCode} 
            className="flex items-center gap-2"
          >
            <Share2 size={16} />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
