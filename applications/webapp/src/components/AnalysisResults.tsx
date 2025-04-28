import React, { useState } from 'react';
import { AnalysisResult } from '@/types';
import { Globe, Search, BarChart2, FileText, RefreshCw } from 'lucide-react';

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const domain = results.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const date = new Date(results.timestamp * 1000);
  const formattedDate = date.toLocaleString();
  
  return (
    <div className="space-y-6 mt-8">
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Search className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Analysis Complete</h2>
              <p className="text-sm text-gray-500">
                Analysis completed on {formattedDate}
              </p>
            </div>
          </div>
          <button 
            onClick={onReset}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <RefreshCw size={14} />
            <span>New Analysis</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 bg-blue-50 py-2 px-3 rounded mb-4">
          <Globe size={16} className="text-blue-600" />
          <a 
            href={results.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 font-medium hover:underline truncate"
          >
            {domain}
          </a>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Summary</h3>
          <p className="text-gray-600">
            {results.result_summary}
          </p>
        </div>
      </div>
      
      <div className="card">
        <div className="border-b border-gray-200 mb-4">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 0
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Analysis Results
            </button>
            {results.tasks.map((task) => (
              <button
                key={task.task_number}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === task.task_number
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(task.task_number)}
              >
                Task {task.task_number}
              </button>
            ))}
          </div>
        </div>
        
        <div className="prose max-w-none">
          {activeTab === 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {results.tasks.map((task) => (
                  <div key={task.task_number} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-1.5 rounded mr-2">
                        <BarChart2 size={16} className="text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-800">
                        Task {task.task_number}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{task.task_name}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab(task.task_number)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-2"
                    >
                      <FileText size={14} className="mr-1" />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Findings</h3>
              <div className="whitespace-pre-line text-gray-700">
                {results.analysis_text}
              </div>
            </div>
          ) : (
            <div>
              {results.tasks
                .filter((task) => task.task_number === activeTab)
                .map((task) => (
                  <div key={task.task_number}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.task_name}</h3>
                    <div className="whitespace-pre-line text-gray-700">
                      {task.task_output}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onReset}
            className="btn-secondary"
          >
            New Analysis
          </button>
          
          <a
            href={results.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Globe size={16} className="mr-2" />
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}