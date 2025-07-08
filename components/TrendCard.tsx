import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { YouTubeTrend, ContentIdeas } from '../types';
import { generateContentIdeas } from '../services/youtubeTrendService';

interface TrendCardProps {
  trend: YouTubeTrend;
  index: number;
  isSaved: boolean;
  onSaveToggle: (trend: YouTubeTrend) => void;
}

// ... Icon components remain the same ...
const IconVideo: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
    </svg>
);
const IconSearch: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);
const IconBarChart: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);
const IconSparkles: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


const TrendCard: React.FC<TrendCardProps> = ({ trend, index, isSaved, onSaveToggle }) => {
  const animationDelay = `${index * 50}ms`;
  const saturation = trend.dailySearches > 0 ? (trend.videoCount / trend.dailySearches) * 100 : 0;

  const [ideas, setIdeas] = useState<ContentIdeas | null>(null);
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);

  const handleGetIdeas = async () => {
    if (ideas) { // Toggle visibility if ideas are already loaded
        setIdeas(null);
        return;
    }
    setIsIdeaLoading(true);
    setIdeaError(null);
    try {
      const fetchedIdeas = await generateContentIdeas(trend.term);
      setIdeas(fetchedIdeas);
    } catch (err) {
      if (err instanceof Error) {
        setIdeaError(err.message);
      } else {
        setIdeaError("An unknown error occurred while fetching ideas.");
      }
    } finally {
      setIsIdeaLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col bg-brand-light-dark p-5 rounded-lg shadow-lg hover:shadow-brand-red/30 transform hover:-translate-y-1 transition-all duration-300 ease-in-out animate-fade-in"
      style={{ animation: 'fade-in 0.5s ease-out forwards', animationDelay }}
    >
      <div className="flex-grow">
         <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-brand-off-white flex-1 pr-2" title={trend.term}>
                {trend.term}
             </h3>
             <button onClick={() => onSaveToggle(trend)} className="p-1 text-gray-400 hover:text-yellow-400 transition-colors" aria-label={isSaved ? 'Unsave idea' : 'Save idea'}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${isSaved ? 'text-yellow-400' : 'text-gray-600'}`}>
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006a.42.42 0 0 0 .364.292l5.518.8c1.131.164 1.587 1.555.765 2.315l-3.995 3.893a.42.42 0 0 0-.121.373l.94 5.503c.192 1.121-.986 1.993-1.964 1.417L12 18.135a.42.42 0 0 0-.392 0l-4.933 2.592c-.978.576-2.156-.296-1.964-1.417l.94-5.503a.42.42 0 0 0-.121-.373L1.51 11.622c-.822-.76-.366-2.151.765-2.315l5.518-.8a.42.42 0 0 0 .364-.292L10.788 3.21Z" clipRule="evenodd" />
                </svg>
             </button>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 text-brand-off-white/80" title="Daily Searches">
            <IconSearch className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="font-semibold">{trend.dailySearches.toLocaleString()}</span>
            <span className="text-sm text-brand-off-white/60"> searches/day</span>
        </div>
        <div className="flex items-center space-x-2 text-brand-off-white/80" title="Existing Videos">
            <IconVideo className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="font-semibold">{trend.videoCount.toLocaleString()}</span>
            <span className="text-sm text-brand-off-white/60"> videos exist</span>
        </div>
        <div className="w-full bg-brand-dark rounded-full h-2.5 my-2">
            <div className="bg-brand-red h-2.5 rounded-full" style={{width: `${Math.min(saturation, 100)}%`}}></div>
        </div>
        <div className="flex items-center space-x-2 text-brand-off-white/80" title="Content Saturation (Videos / Searches)">
            <IconBarChart className="w-5 h-5 text-brand-red flex-shrink-0" />
            <span className="font-semibold">{saturation.toFixed(4)}%</span>
            <span className="text-sm text-brand-off-white/60"> saturation</span>
        </div>
      </div>
      <div className="mt-4 border-t border-brand-off-white/10 pt-4">
        <button onClick={handleGetIdeas} disabled={isIdeaLoading} className="w-full flex items-center justify-center gap-2 bg-brand-red/20 text-brand-off-white/90 hover:bg-brand-red/40 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <IconSparkles className="w-5 h-5"/>
            {isIdeaLoading ? "Generating..." : ideas ? "Hide Ideas" : "Get Ideas"}
        </button>
        {isIdeaLoading && <div className="text-center text-sm text-brand-off-white/70 mt-2">Sparking creativity...</div>}
        {ideaError && <div className="text-center text-sm text-red-400 mt-2">{ideaError}</div>}
        {ideas && (
             <div className="mt-4 space-y-4 animate-fade-in-slow">
                <div>
                    <h4 className="font-bold text-md text-brand-off-white">Click-Worthy Titles:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-brand-off-white/80 text-sm">
                        {ideas.titles.map((title, i) => <li key={i}>{title}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-md text-brand-off-white">Sample Outline:</h4>
                    <div className="prose prose-sm prose-invert mt-2 text-brand-off-white/80">
                        <ReactMarkdown>{ideas.outline}</ReactMarkdown>
                    </div>
                </div>
            </div>
        )}
      </div>
       <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
           @keyframes fade-in-slow {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in { animation-fill-mode: backwards; }
          .animate-fade-in-slow { animation: fade-in-slow 0.5s ease-in-out; }
          .prose-invert {
            --tw-prose-body: #D1D5DB;
            --tw-prose-headings: #F9FAFB;
            --tw-prose-bold: #F9FAFB;
            --tw-prose-bullets: #FF0000;
          }
        `}
      </style>
    </div>
  );
};

export default TrendCard;