import React from 'react';
import { Globe, Brain, BarChart } from 'lucide-react';

interface LoadingStateProps {
  status: 'queued' | 'running';
  url: string;
}

export default function LoadingState({ status, url }: LoadingStateProps) {
  // Get the domain from the URL for display
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  return (
    <div className="card mt-8 text-center">
      <div className="flex justify-center mb-6">
        {status === 'queued' ? (
          <div className="relative">
            <Globe size={48} className="text-blue-600" />
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <div className="relative">
            <Brain size={48} className="text-blue-600" />
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {status === 'queued' 
          ? 'Analysis Queued' 
          : 'Analyzing Your Website'}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {status === 'queued'
          ? 'Your request is in the queue and will begin processing shortly.'
          : 'Our AI crew is analyzing your website and generating insights.'}
      </p>
      
      <div className="mb-8">
        <div className="bg-blue-50 py-3 px-4 rounded-md inline-flex items-center">
          <Globe size={16} className="text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">{domain}</span>
        </div>
      </div>
      
      <div className="relative pt-1 mb-8">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {status === 'queued' ? 'In Queue' : 'Analyzing'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {status === 'queued' ? '25%' : '75%'}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div 
            style={{ width: status === 'queued' ? '25%' : '75%' }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {status === 'queued' ? (
          <div className="text-gray-500 text-sm">
            Preparing analysis agents...
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center space-x-2">
              <BarChart size={16} className="text-green-500" />
              <span className="text-sm text-gray-600">Analyzing page structure</span>
              <span className="ml-1 text-green-500 text-xs">✓</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <BarChart size={16} className="text-blue-500 animate-pulse" />
              <span className="text-sm text-gray-600">Analyzing visual elements</span>
            </div>
            <div className="flex items-center justify-center space-x-2 opacity-50">
              <BarChart size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">Generating recommendations</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}