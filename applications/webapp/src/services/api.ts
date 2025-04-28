import { AnalysisResponse, StatusResponse, ResultsResponse } from '@/types';

const API_BASE_URL = '/api';

/**
 * Start a new SEO analysis for the provided URL
 */
export async function startAnalysis(url: string): Promise<AnalysisResponse> {
  console.log(`Sending analysis request for URL: ${url}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/seo/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API error response:', errorData);
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Analysis started successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to start analysis:', error);
    throw error;
  }
}

/**
 * Check the status of an ongoing analysis
 */
export async function checkAnalysisStatus(analysisId: string): Promise<StatusResponse> {
  console.log(`Checking status for analysis ID: ${analysisId}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/seo/status/${analysisId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Status check error:', errorData);
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Status check result:', data);
    return data;
  } catch (error) {
    console.error('Failed to check analysis status:', error);
    throw error;
  }
}

/**
 * Get the results of a completed analysis
 */
export async function getAnalysisResults(analysisId: string): Promise<ResultsResponse> {
  console.log(`Getting results for analysis ID: ${analysisId}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/seo/result/${analysisId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Results retrieval error:', errorData);
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Results retrieved successfully');
    return data;
  } catch (error) {
    console.error('Failed to retrieve analysis results:', error);
    throw error;
  }
}

export const healthCheck = async () => {
  try { 
    const response = await fetch(`${API_BASE_URL}/seo/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    const data = await response.json();
    console.log('Health check response:', data);
  }
  catch (error) {
    console.error('Error during health check:', error);
  }
}