'use client';

import React, { useState } from 'react';
import { Globe, Search, BarChart2, FileText, RefreshCw, Brain, Dices } from 'lucide-react';

const SEOAnalysisDemo = () => {
  const [step, setStep] = useState('form'); // steps: form, loading, results
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setErrorMsg('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setErrorMsg('URL must start with http:// or https://');
      return;
    }

    setErrorMsg('');
    setStep('loading');
    
    setTimeout(() => {
      setStep('results');
    }, 2000);
  };

  const handleReset = () => {
    setUrl('');
    setStep('form');
    setActiveTab(0);
  };

  // Mock data for the demo
  const mockResults = {
    url: url || 'https://example.com',
    timestamp: Date.now() / 1000,
    result_summary: 'The website has good overall structure but needs improvements in content depth, keyword optimization, and mobile responsiveness. Several quick wins identified for improving rankings.',
    tasks: [
      {
        task_number: 1,
        task_name: 'Content Analysis',
        task_output: 'Content analysis shows that the page has moderate-quality content but lacks depth in key topic areas. Headings are not optimally structured, with H1 and H2 tags not clearly defining page sections. Keyword density is low for primary terms.\n\nRecommendations:\n- Expand content in key sections to provide more comprehensive coverage\n- Restructure headings to create a more logical hierarchy\n- Increase natural usage of primary keywords throughout the content'
      },
      {
        task_number: 2,
        task_name: 'Visual Analysis',
        task_output: 'Visual analysis indicates several large unoptimized images affecting page load speed. Mobile responsiveness issues detected in several page sections. Layout structure creates good visual hierarchy but some important content is pushed below the fold.\n\nRecommendations:\n- Optimize image sizes and implement lazy loading\n- Fix responsive design issues on mobile devices\n- Improve layout to bring key content above the fold'
      },
      {
        task_number: 3,
        task_name: 'Long-term SEO Strategy',
        task_output: 'The landing page needs a more comprehensive strategy for long-term SEO performance. Current content lacks evergreen qualities and structured data implementation. Social proof elements are minimal.\n\nRecommendations:\n- Develop more evergreen content that remains relevant\n- Implement schema markup for rich snippets\n- Add testimonials and case studies to enhance credibility\n- Create a content update schedule to keep the page fresh'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <header className="bg-white shadow-sm rounded-lg mb-6">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dices size={28} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Crew AI</h1>
              <p className="text-sm text-gray-600">AI-powered SEO analysis</p>
            </div>
          </div>
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              Beta
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {step === 'form' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analyze Your Website&apos;s SEO
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your website URL below to get a comprehensive SEO analysis powered by AI. 
              Our tool will analyze your page structure, content, and visuals to provide actionable recommendations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="url"
                    className={`w-full p-3 pl-10 border ${errorMsg ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
                {errorMsg && <p className="mt-1 text-sm text-red-600">{errorMsg}</p>}
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Start Analysis
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">What we analyze:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm font-medium text-gray-800">Content Quality</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm font-medium text-gray-800">Page Structure</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm font-medium text-gray-800">Visual Elements</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Brain size={48} className="text-blue-600" />
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Analyzing Your Website
            </h2>
            
            <p className="text-gray-600 mb-6">
              Our AI crew is analyzing your website and generating insights.
            </p>
            
            <div className="mb-8">
              <div className="bg-blue-50 py-3 px-4 rounded-md inline-flex items-center">
                <Globe size={16} className="text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">{url.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>
            
            <div className="relative pt-1 mb-8">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Analyzing
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    75%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: '75%' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <BarChart2 size={16} className="text-green-500" />
                <span className="text-sm text-gray-600">Analyzing page structure</span>
                <span className="ml-1 text-green-500 text-xs">✓</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <BarChart2 size={16} className="text-blue-500 animate-pulse" />
                <span className="text-sm text-gray-600">Analyzing visual elements</span>
              </div>
              <div className="flex items-center justify-center space-x-2 opacity-50">
                <BarChart2 size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">Generating recommendations</span>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Search className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Analysis Complete</h2>
                    <p className="text-sm text-gray-500">
                      Analysis completed on {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleReset}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <RefreshCw size={14} />
                  <span>New Analysis</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50 py-2 px-3 rounded mb-4">
                <Globe size={16} className="text-blue-600" />
                <span className="text-blue-700 font-medium">
                  {url.replace(/^https?:\/\//, '')}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Summary</h3>
                <p className="text-gray-600">
                  {mockResults.result_summary}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                  {mockResults.tasks.map((task) => (
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
                      {mockResults.tasks.map((task) => (
                        <div key={task.task_number} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <div className="bg-blue-100 p-1.5 rounded mr-2">
                              <BarChart2 size={16} className="text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-800">
                              Task {task.task_number}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{task.task_name}</p>
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
                      {mockResults.tasks.map(task => task.task_output).join('\n\n')}
                    </div>
                  </div>
                ) : (
                  <div>
                    {mockResults.tasks
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
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  New Analysis
                </button>
                
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <Globe size={16} className="mr-2" />
                  Visit Website
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOAnalysisDemo;