import { useState } from 'react';
import { Search } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (url: string) => void;
}

export default function AnalysisForm({ onSubmit }: AnalysisFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: proper URL validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Check for basic URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setError(null);
    onSubmit(url);
  };

  return (
    <div className="card mt-8">
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
              className={`input-field pl-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
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
  );
}