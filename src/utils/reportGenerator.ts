
import { PatientData, TestDetails } from './storageUtils';

export const generateReportHTML = (patient: PatientData): string => {
  const createdDate = new Date(patient.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate HTML for test results
  const testResultsHTML = patient.testDetails.map((test) => {
    // Function to determine file icon based on file type
    const getFileIcon = (type: string): string => {
      if (type.startsWith('image/')) return 'IMAGE';
      if (type.includes('pdf')) return 'PDF';
      if (type.includes('excel') || type.includes('spreadsheet') || type.includes('csv')) return 'SHEET';
      if (type.includes('word') || type.includes('document')) return 'DOC';
      if (type.includes('audio')) return 'AUDIO';
      if (type.includes('video')) return 'VIDEO';
      return 'FILE';
    };

    // Generate attachments HTML if test has attachments
    const attachmentsHTML = test.attachments && test.attachments.length > 0
      ? `
        <div class="attachments-section">
          <h4>Attachments</h4>
          <div class="attachments-grid">
            ${test.attachments.map(attachment => {
              if (attachment.type.startsWith('image/')) {
                return `
                  <div class="attachment-item">
                    <div class="attachment-preview">
                      <img src="${attachment.dataUrl}" alt="${attachment.name}" />
                    </div>
                    <div class="attachment-info">
                      <div class="attachment-name" title="${attachment.name}">${attachment.name}</div>
                      <div class="attachment-type">Image File</div>
                    </div>
                  </div>
                `;
              } else {
                const fileIcon = getFileIcon(attachment.type);
                const fileType = attachment.type.split('/').pop()?.toUpperCase() || 'File';
                return `
                  <div class="attachment-item">
                    <div class="attachment-preview file-preview">
                      <div class="file-icon file-icon-${fileIcon.toLowerCase()}">${fileIcon}</div>
                    </div>
                    <div class="attachment-info">
                      <div class="attachment-name" title="${attachment.name}">${attachment.name}</div>
                      <div class="attachment-type">${fileType} File</div>
                    </div>
                  </div>
                `;
              }
            }).join('')}
          </div>
        </div>
      `
      : '';
    
    return `
      <div class="test-result">
        <div class="test-header">
          <h3>${test.testName}</h3>
          <span class="test-date">${new Date(test.testDate).toLocaleDateString()}</span>
        </div>
        <div class="test-body">
          <div class="test-row">
            <div class="test-cell">Type:</div>
            <div class="test-cell">${test.testType}</div>
          </div>
          <div class="test-row">
            <div class="test-cell">Result:</div>
            <div class="test-cell">${test.testResult}</div>
          </div>
          ${test.normalRange ? `
          <div class="test-row">
            <div class="test-cell">Normal Range:</div>
            <div class="test-cell">${test.normalRange}</div>
          </div>
          ` : ''}
          ${test.notes ? `
          <div class="test-row">
            <div class="test-cell">Notes:</div>
            <div class="test-cell">${test.notes}</div>
          </div>
          ` : ''}
          ${attachmentsHTML}
        </div>
      </div>
    `;
  }).join('');

  // Complete HTML report
  return `
    <div class="report-container">
      <div class="report-header">
        <h1>Medical Report</h1>
        <div class="report-meta">
          <div>Patient ID: <strong>${patient.id}</strong></div>
          <div>Report Date: ${formattedDate}</div>
        </div>
      </div>
      
      <div class="patient-info">
        <h2>Patient Information</h2>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${patient.firstName} ${patient.lastName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Age:</div>
            <div class="info-value">${patient.age} years</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gender:</div>
            <div class="info-value">${patient.gender}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Contact:</div>
            <div class="info-value">${patient.contact}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${patient.email}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Address:</div>
            <div class="info-value">${patient.address}</div>
          </div>
        </div>
      </div>
      
      <div class="test-results">
        <h2>Test Results</h2>
        ${testResultsHTML}
      </div>
      
      <div class="report-footer">
        <p>This report is generated automatically. Please consult with a healthcare professional for interpretation.</p>
      </div>
    </div>
  `;
};

export const generateReportCSS = (): string => {
  return `
    .report-container {
      font-family: 'Inter var', system-ui, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    
    .report-header {
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .report-header h1 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1c1c1e;
    }
    
    .report-meta {
      display: flex;
      justify-content: space-between;
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem;
      color: #1c1c1e;
    }
    
    .info-grid, .test-result {
      background-color: #f9fafb;
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .info-row, .test-row {
      display: flex;
      margin-bottom: 0.5rem;
      font-size: 0.9375rem;
    }
    
    .info-label, .test-cell:first-child {
      width: 120px;
      font-weight: 500;
      color: #4b5563;
    }
    
    .info-value, .test-cell:last-child {
      flex: 1;
    }
    
    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    
    .test-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: #1c1c1e;
    }
    
    .test-date {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .test-body {
      padding-top: 0.5rem;
    }
    
    .report-footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eaeaea;
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
    }
    
    /* Enhanced CSS for attachments */
    .attachments-section {
      margin-top: 1.5rem;
      border-top: 1px dashed #eaeaea;
      padding-top: 1rem;
    }
    
    .attachments-section h4 {
      font-size: 1rem;
      font-weight: 500;
      margin: 0 0 0.75rem 0;
      color: #4b5563;
    }
    
    .attachments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .attachment-item {
      border: 1px solid #eaeaea;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .attachment-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .attachment-preview {
      height: 140px;
      overflow: hidden;
      background-color: #f4f5f7;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .attachment-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .file-preview {
      background-color: #f0f4f8;
    }
    
    .file-icon {
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      background-color: #4f46e5;
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
    }
    
    .file-icon-pdf {
      background-color: #ef4444;
    }
    
    .file-icon-doc {
      background-color: #2563eb;
    }
    
    .file-icon-sheet {
      background-color: #16a34a;
    }
    
    .file-icon-image {
      background-color: #d946ef;
    }
    
    .file-icon-audio {
      background-color: #f59e0b;
    }
    
    .file-icon-video {
      background-color: #6366f1;
    }
    
    .attachment-info {
      padding: 0.75rem;
    }
    
    .attachment-name {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .attachment-type {
      font-size: 0.75rem;
      color: #6b7280;
    }
  `;
};
