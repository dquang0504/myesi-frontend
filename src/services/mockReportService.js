/**
 * Mock Report Service
 * Simulates backend API responses for report generation and downloads
 */

// Simulate network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Compliance Report Data
 */
const MOCK_COMPLIANCE_REPORT = {
  reportId: 'RPT-COMP-2025-001',
  generatedAt: new Date().toISOString(),
  reportType: 'compliance',
  overallScore: 89,
  frameworks: [
    { name: 'ISO 27001', score: 92, status: 'Compliant', controls: 114, passed: 105, failed: 9 },
    { name: 'SOC 2', score: 88, status: 'Compliant', controls: 64, passed: 56, failed: 8 },
    { name: 'GDPR', score: 95, status: 'Compliant', controls: 43, passed: 41, failed: 2 },
    { name: 'PCI DSS', score: 78, status: 'Needs Attention', controls: 78, passed: 61, failed: 17 },
    { name: 'HIPAA', score: 85, status: 'Compliant', controls: 52, passed: 44, failed: 8 },
    { name: 'NIST CSF', score: 90, status: 'Compliant', controls: 98, passed: 88, failed: 10 },
  ],
  summary: {
    totalControls: 449,
    passedControls: 395,
    failedControls: 54,
    compliancePercentage: 88,
  },
};

/**
 * Download compliance report as PDF
 * In production, this would return a blob or trigger a file download
 */
export const mockDownloadComplianceReport = async (format = 'pdf') => {
  await delay(1200);
  
  // Simulate PDF blob creation
  const mockPdfContent = `Compliance Report - ${new Date().toLocaleDateString()}\n\nOverall Score: ${MOCK_COMPLIANCE_REPORT.overallScore}%\n\nFrameworks:\n${MOCK_COMPLIANCE_REPORT.frameworks.map(f => `- ${f.name}: ${f.score}%`).join('\n')}`;
  
  const blob = new Blob([mockPdfContent], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  
  return {
    data: {
      success: true,
      blob: blob,
      filename: `compliance-report-${new Date().toISOString().split('T')[0]}.${format}`,
      reportId: MOCK_COMPLIANCE_REPORT.reportId,
    },
  };
};

/**
 * Get compliance report data (for preview or table display)
 */
export const mockGetComplianceReport = async () => {
  await delay(600);
  
  return {
    data: MOCK_COMPLIANCE_REPORT,
  };
};

/**
 * Download vulnerability report as PDF/CSV
 */
export const mockDownloadVulnerabilityReport = async (format = 'pdf') => {
  await delay(1000);
  
  const mockContent = `Vulnerability Report - ${new Date().toLocaleDateString()}\n\nTotal Vulnerabilities: 87\nCritical: 7\nHigh: 15\nMedium: 23\nLow: 42`;
  
  const blob = new Blob([mockContent], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  
  return {
    data: {
      success: true,
      blob: blob,
      filename: `vulnerability-report-${new Date().toISOString().split('T')[0]}.${format}`,
    },
  };
};

/**
 * Download SBOM report as PDF/CSV
 */
export const mockDownloadSBOMReport = async (format = 'pdf') => {
  await delay(1000);
  
  const mockContent = `SBOM Report - ${new Date().toLocaleDateString()}\n\nTotal SBOMs: 89\nScanned: 76\nComponents: 2,145`;
  
  const blob = new Blob([mockContent], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  
  return {
    data: {
      success: true,
      blob: blob,
      filename: `sbom-report-${new Date().toISOString().split('T')[0]}.${format}`,
    },
  };
};

/**
 * Check if mock service should be used
 */
export const useMockReports = () => {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true';
};
