'use client';

import { useState } from 'react';
import SEOHeader from '@/components/SEOHeader';
import AnalysisForm from '@/components/AnalysisForm';
import LoadingState from '@/components/LoadingState';
import AnalysisResults from '@/components/AnalysisResults';
import { startAnalysis, checkAnalysisStatus, getAnalysisResults } from '@/services/api';
import { AnalysisResult } from '@/types';

export default function SEOHome() {
  const [url, setUrl] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (submittedUrl: string) => {
    try {
      setUrl(submittedUrl);
      setAnalysisStatus('queued');
      setError(null);
      
      const response = await startAnalysis(submittedUrl);
      
      // Begin polling for status
      pollStatus(response.analysis_id);
    } catch (err) {
      setAnalysisStatus('failed');
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
    }
  };

  const pollStatus = async (id: string) => {
    try {
      const statusResponse = await checkAnalysisStatus(id);
      
      setAnalysisStatus(statusResponse.status);
      
      if (statusResponse.status === 'completed') {
        const resultsResponse = await getAnalysisResults(id);
        setResults(resultsResponse.result);
      } else if (statusResponse.status === 'failed') {
        setError(statusResponse.error || 'Analysis failed');
      } else {
        // Continue polling if not complete or failed
        setTimeout(() => pollStatus(id), 3000);
      }
    } catch (err) {
      setAnalysisStatus('failed');
      setError(err instanceof Error ? err.message : 'Failed to check analysis status');
    }
  };

  const handleReset = () => {
    setUrl('');
    setAnalysisStatus('idle');
    setResults(null);
    setError(null);
  };

  const isLoading = analysisStatus === 'queued' || analysisStatus === 'running';
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <SEOHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {analysisStatus === 'idle' ? (
          <AnalysisForm onSubmit={handleSubmit} />
        ) : isLoading ? (
          <LoadingState status={analysisStatus} url={url} />
        ) : analysisStatus === 'completed' && results ? (
          <AnalysisResults results={results} onReset={handleReset} />
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Analysis Error</h2>
            <p className="text-gray-700 mb-4">{error || 'An unknown error occurred'}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}