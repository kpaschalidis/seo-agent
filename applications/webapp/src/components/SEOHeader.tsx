import { Dices } from 'lucide-react';

export default function SEOHeader() {
  return (
    <header className="bg-white shadow-sm">
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
  );
}