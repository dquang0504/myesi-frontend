import axiosInstance from '../utils/axios';
import {
  useMockReports,
  mockDownloadComplianceReport,
  mockGetComplianceReport,
  mockDownloadVulnerabilityReport,
  mockDownloadSBOMReport,
} from './mockReportService';

/**
 * Report Service
 * Handles report generation and downloads
 */
export const reportService = {
  /**
   * Download compliance report
   * @param {string} format - 'pdf' or 'csv'
   * @returns {Promise} - Returns blob data for download
   */
  downloadComplianceReport: async (format = 'pdf') => {
    if (useMockReports()) {
      return mockDownloadComplianceReport(format);
    }
    
    const response = await axiosInstance.get('/api/reports/compliance', {
      params: { format },
      responseType: 'blob', // Important for file downloads
    });
    
    // Create blob from response
    const blob = new Blob([response.data], { 
      type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
    });
    
    return {
      data: {
        success: true,
        blob: blob,
        filename: `compliance-report-${new Date().toISOString().split('T')[0]}.${format}`,
      },
    };
  },

  /**
   * Get compliance report data (for preview/table display)
   * @returns {Promise} - Returns compliance report data
   */
  getComplianceReport: async () => {
    if (useMockReports()) {
      return mockGetComplianceReport();
    }
    
    const response = await axiosInstance.get('/api/reports/compliance/data');
    return response;
  },

  /**
   * Download vulnerability report
   * @param {string} format - 'pdf' or 'csv'
   * @param {Object} filters - Optional filters (severity, dateRange, etc.)
   * @returns {Promise} - Returns blob data for download
   */
  downloadVulnerabilityReport: async (format = 'pdf', filters = {}) => {
    if (useMockReports()) {
      return mockDownloadVulnerabilityReport(format);
    }
    
    const response = await axiosInstance.get('/api/reports/vulnerabilities', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { 
      type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
    });
    
    return {
      data: {
        success: true,
        blob: blob,
        filename: `vulnerability-report-${new Date().toISOString().split('T')[0]}.${format}`,
      },
    };
  },

  /**
   * Download SBOM report
   * @param {string} format - 'pdf' or 'csv'
   * @returns {Promise} - Returns blob data for download
   */
  downloadSBOMReport: async (format = 'pdf') => {
    if (useMockReports()) {
      return mockDownloadSBOMReport(format);
    }
    
    const response = await axiosInstance.get('/api/reports/sbom', {
      params: { format },
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { 
      type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
    });
    
    return {
      data: {
        success: true,
        blob: blob,
        filename: `sbom-report-${new Date().toISOString().split('T')[0]}.${format}`,
      },
    };
  },

  /**
   * Utility function to trigger browser download
   * @param {Blob} blob - The blob to download
   * @param {string} filename - Name for the downloaded file
   */
  triggerDownload: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
