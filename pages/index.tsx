import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import ReactMarkdown from 'react-markdown';

// --- TYPES ---
interface YouTubeTrend {
  term: string;
  dailySearches: number;
  videoCount: number;
}
type SortOption = 'dailySearches' | 'saturation' | 'videoCount';
interface ContentIdeas {
    titles: string[];
    outline: string;
}
type ViewOption = 'search' | 'saved';

// --- IMPORTANT ---
// Once you deploy your backend to Vercel, you will get a URL.
// Replace the placeholder below with your actual Vercel URL.
const BACKEND_URL = 'https://ytgap-app.vercel.app/api/trends';


// --- API SERVICE ---
const handleApiError = (error: unknown, context: string): never => {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error(`An unknown error occurred during ${context}.`);
}

const fetchYouTubeTrends = async (selectedDate: string, niche: string, searchVolume: string, saturationLevel: string): Promise<YouTubeTrend[]> => {
    if (BACKEND_URL.includes('YOUR_VERCEL_BACKEND_URL')) {
        throw new Error("Configuration Error: Please update the BACKEND_URL in index.tsx with your Vercel deployment URL.");
          }
  return [];
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'fetchTrends', payload: { selectedDate, niche, searchVolume, saturationLevel } }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch trends.');
        return data as YouTubeTrend[];
    } catch (error) {
        handleApiError(error, 'fetching YouTube trends');
      throw error;
    }
};

const generateContentIdeas = async (term: string): Promise<ContentIdeas> => {
    if (BACKEND_URL.includes('YOUR_VERCEL_BACKEND_URL')) {
        throw new Error("Configuration Error: Please update the BACKEND_URL in index.tsx with your Vercel deployment URL.");
    }
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generateIdeas', payload: { term } }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to generate content ideas.');
        return data as ContentIdeas;
    } catch (error) {
        handleApiError(error, 'generating content ideas');
        throw error; // <--- THIS IS THE KEY!
    }
};


// --- LOCAL STORAGE UTILS ---
const STORAGE_KEY = 'ytgap_savedTrends';
const getSavedTrends = (): YouTubeTrend[] => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Failed to get saved trends:", error);
        return [];
    }
};
const saveTrends = (trends: YouTubeTrend[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trends));
    } catch (error) {
        console.error("Failed to save trends:", error);
    }
};


// --- COMPONENTS ---

const Logo: React.FC = () => (
  <svg viewBox="0 0 250 60" className="h-12 w-auto" aria-label="YTGAP Logo">
    <title>YTGAP Logo</title>
    <style>{`
      .logo-text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 60px; }
    `}</style>
    <text className="logo-text" y="50" fill="#FF0000">YT</text>
    <text className="logo-text" x="95" y="50" fill="#F1F1F1">G</text>
    <g transform="translate(145, 0)">
      <path d="M 0 50 L 25 5 L 50 50" stroke="#F1F1F1" strokeWidth="9" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 20 28 L 32 35 L 20 42 Z" fill="#FF0000" />
    </g>
    <text className="logo-text" x="195" y="50" fill="#F1F1F1">P</text>
  </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center text-[#F1F1F1]">
      <div className="w-16 h-16 border-4 border-[#FF0000] border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-6 text-xl font-semibold">Searching for Hidden Gems...</p>
      <p className="mt-2 text-[#F1F1F1]/70">This powerful search may take a moment. Please be patient.</p>
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-900/50 border border-[#FF0000] text-red-100 px-4 py-3 rounded-lg" role="alert">
      <strong className="font-bold">Error: </strong>
      <span>{message}</span>
    </div>
);

interface HeaderProps {
  selectedDate: string; onDateChange: (d: string) => void;
  niche: string; onNicheChange: (n: string) => void;
  onSearch: () => void;
  searchVolume: string; onSearchVolumeChange: (v: string) => void;
  saturationLevel: string; onSaturationLevelChange: (l: string) => void;
  sortBy: SortOption; onSortByChange: (s: SortOption) => void;
  currentView: ViewOption; onViewChange: (v: ViewOption) => void;
  savedTrendsCount: number;
}

const Header: React.FC<HeaderProps> = ({ selectedDate, onDateChange, niche, onNicheChange, onSearch, searchVolume, onSearchVolumeChange, saturationLevel, onSaturationLevelChange, sortBy, onSortByChange, currentView, onViewChange, savedTrendsCount }) => {
  const inputStyles = "bg-[#374151] border border-white/20 text-[#F1F1F1] text-sm rounded-lg focus:ring-[#FF0000] focus:border-[#FF0000] block w-full p-2.5 placeholder-gray-400";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onSearch(); };
    
  return (
    <header className="border-b-2 border-[#374151] pb-8 space-y-8">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Logo />
        <p className="text-lg text-[#F1F1F1]/70 -mt-2">Find what's wanted. Create what's missing.</p>
      </div>
      <div className="flex justify-center">
          <div className="relative inline-flex bg-[#374151] p-1 rounded-lg w-full max-w-xs">
            <div 
                className="absolute top-1 bottom-1 w-1/2 bg-[#FF0000]/50 rounded-md transition-transform duration-300 ease-in-out"
                style={{ transform: currentView === 'search' ? 'translateX(0%)' : 'translateX(100%)' }}
            ></div>
            <button onClick={() => onViewChange('search')} className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'search' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Search</button>
            <button onClick={() => onViewChange('saved')} className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${currentView === 'saved' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                My Saved Ideas
                {savedTrendsCount > 0 && (<span className="bg-[#FF0000] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{savedTrendsCount}</span>)}
            </button>
          </div>
      </div>
      {currentView === 'search' && (
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
            <div className="w-full sm:w-auto">
               <label htmlFor="date-picker" className="block mb-2 text-sm font-medium text-[#F1F1F1]/70">Date</label>
               <input id="date-picker" type="date" value={selectedDate} onChange={(e) => onDateChange(e.target.value)} className={inputStyles} aria-label="Select date"/>
            </div>
            <div className="w-full sm:w-auto sm:flex-grow max-w-xs">
                <label htmlFor="niche-input" className="block mb-2 text-sm font-medium text-[#F1F1F1]/70">Niche (Optional)</label>
                <input id="niche-input" type="text" value={niche} onChange={(e) => onNicheChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., 'vintage synths'" className={inputStyles} aria-label="Enter niche"/>
            </div>
            <div className="w-full sm:w-auto"><button onClick={onSearch} className="w-full sm:w-auto bg-[#FF0000] hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-200 hover:scale-105">Search</button></div>
        </div>
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 pt-4">
            <div className="w-full sm:w-auto">
                <label htmlFor="search-volume" className="block mb-2 text-sm font-medium text-[#F1F1F1]/70">Min. Search Volume</label>
                <select id="search-volume" value={searchVolume} onChange={e => onSearchVolumeChange(e.target.value)} className={inputStyles} aria-label="Minimum search volume">
                    <option value="10000">&gt; 10,000</option><option value="50000">&gt; 50,000</option><option value="100000">&gt; 100,000</option><option value="500000">&gt; 500,000</option>
                </select>
            </div>
            <div className="w-full sm:w-auto">
                <label htmlFor="saturation-level" className="block mb-2 text-sm font-medium text-[#F1F1F1]/70">Max. Saturation</label>
                <select id="saturation-level" value={saturationLevel} onChange={e => onSaturationLevelChange(e.target.value)} className={inputStyles} aria-label="Maximum content saturation">
                    <option value="0.05">&lt; 5%</option><option value="0.01">&lt; 1%</option><option value="0.001">&lt; 0.1%</option><option value="0.0001">&lt; 0.01%</option>
                </select>
            </div>
            <div className="w-full sm:w-auto">
                <label htmlFor="sort-by" className="block mb-2 text-sm font-medium text-[#F1F1F1]/70">Sort By</label>
                <select id="sort-by" value={sortBy} onChange={e => onSortByChange(e.target.value as SortOption)} className={inputStyles} aria-label="Sort results by">
                    <option value="dailySearches">Highest Searches</option><option value="saturation">Lowest Saturation</option><option value="videoCount">Lowest Video Count</option>
                </select>
            </div>
        </div>
      </div>
      )}
    </header>
  );
};

const IconVideo: React.FC<{ className: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>);
const IconSearch: React.FC<{ className: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>);
const IconBarChart: React.FC<{ className: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>);
const IconSparkles: React.FC<{className: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>);

const TrendCard: React.FC<{ trend: YouTubeTrend, index: number, isSaved: boolean, onSaveToggle: (t: YouTubeTrend) => void }> = ({ trend, index, isSaved, onSaveToggle }) => {
  const saturation = trend.dailySearches > 0 ? (trend.videoCount / trend.dailySearches) * 100 : 0;
  const [ideas, setIdeas] = useState<ContentIdeas | null>(null);
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);

  const handleGetIdeas = async () => {
    if (ideas) { setIdeas(null); return; }
    setIsIdeaLoading(true); setIdeaError(null);
    try {
      const fetchedIdeas = await generateContentIdeas(trend.term);
      setIdeas(fetchedIdeas);
    } catch (err) {
      setIdeaError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsIdeaLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#374151] p-5 rounded-lg shadow-lg hover:shadow-[#FF0000]/30 transform hover:-translate-y-1 transition-all animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex-grow">
         <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-[#F1F1F1] flex-1 pr-2">{trend.term}</h3>
             <button onClick={() => onSaveToggle(trend)} className="p-1" aria-label={isSaved ? 'Unsave idea' : 'Save idea'}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 transition-colors ${isSaved ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006a.42.42 0 0 0 .364.292l5.518.8c1.131.164 1.587 1.555.765 2.315l-3.995 3.893a.42.42 0 0 0-.121.373l.94 5.503c.192 1.121-.986 1.993-1.964 1.417L12 18.135a.42.42 0 0 0-.392 0l-4.933 2.592c-.978.576-2.156-.296-1.964-1.417l.94-5.503a.42.42 0 0 0-.121-.373L1.51 11.622c-.822-.76-.366-2.151.765-2.315l5.518-.8a.42.42 0 0 0 .364-.292L10.788 3.21Z" clipRule="evenodd" /></svg>
             </button>
        </div>
      </div>
      <div className="flex flex-col space-y-3 text-[#F1F1F1]/80">
        <div className="flex items-center space-x-2" title="Daily Searches"><IconSearch className="w-5 h-5 text-green-400 shrink-0"/><span className="font-semibold">{trend.dailySearches.toLocaleString()}</span><span className="text-sm text-[#F1F1F1]/60">searches/day</span></div>
        <div className="flex items-center space-x-2" title="Existing Videos"><IconVideo className="w-5 h-5 text-blue-400 shrink-0"/><span className="font-semibold">{trend.videoCount.toLocaleString()}</span><span className="text-sm text-[#F1F1F1]/60">videos exist</span></div>
        <div className="w-full bg-[#111827] rounded-full h-2.5 my-2"><div className="bg-[#FF0000] h-2.5 rounded-full" style={{width: `${Math.min(saturation, 100)}%`}}></div></div>
        <div className="flex items-center space-x-2" title="Content Saturation (Videos / Searches)"><IconBarChart className="w-5 h-5 text-[#FF0000] shrink-0"/><span className="font-semibold">{saturation.toFixed(4)}%</span><span className="text-sm text-[#F1F1F1]/60">saturation</span></div>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4">
        <button onClick={handleGetIdeas} disabled={isIdeaLoading} className="w-full flex items-center justify-center gap-2 bg-[#FF0000]/20 text-white/90 hover:bg-[#FF0000]/40 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
            <IconSparkles className="w-5 h-5"/>{isIdeaLoading ? "Generating..." : ideas ? "Hide Ideas" : "Get Ideas"}
        </button>
        {isIdeaLoading && <div className="text-center text-sm text-[#F1F1F1]/70 mt-2">Sparking creativity...</div>}
        {ideaError && <div className="text-center text-sm text-red-400 mt-2">{ideaError}</div>}
        {ideas && (
             <div className="mt-4 space-y-4 animate-fade-in">
                <div>
                    <h4 className="font-bold text-md text-[#F1F1F1]">Click-Worthy Titles:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-[#F1F1F1]/80 text-sm">{ideas.titles.map((title, i) => <li key={i}>{title}</li>)}</ul>
                </div>
                <div>
                    <h4 className="font-bold text-md text-[#F1F1F1]">Sample Outline:</h4>
                    <div className="prose prose-sm prose-invert mt-2 text-[#F1F1F1]/80"><ReactMarkdown>{ideas.outline}</ReactMarkdown></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
    const [trends, setTrends] = useState<YouTubeTrend[]>([]);
    const [savedTrends, setSavedTrends] = useState<YouTubeTrend[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [niche, setNiche] = useState('');
    const [searchVolume, setSearchVolume] = useState('50000');
    const [saturationLevel, setSaturationLevel] = useState('0.01');
    const [sortBy, setSortBy] = useState<SortOption>('dailySearches');
    const [currentView, setCurrentView] = useState<ViewOption>('search');
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => { setSavedTrends(getSavedTrends()); }, []);

    const handleSearch = async () => {
        setIsLoading(true); setError(null); setTrends([]); setHasSearched(true);
        try {
            const fetchedTrends = await fetchYouTubeTrends(selectedDate, niche, searchVolume, saturationLevel);
            setTrends(fetchedTrends);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveToggle = (trendToToggle: YouTubeTrend) => {
        const isSaved = savedTrends.some(t => t.term === trendToToggle.term);
        const updated = isSaved ? savedTrends.filter(t => t.term !== trendToToggle.term) : [...savedTrends, trendToToggle];
        setSavedTrends(updated);
        saveTrends(updated);
    };
    
    const sortedTrends = useMemo(() => {
        const data = currentView === 'search' ? trends : savedTrends;
        return [...data].sort((a, b) => {
            if (sortBy === 'dailySearches') return b.dailySearches - a.dailySearches;
            if (sortBy === 'videoCount') return a.videoCount - b.videoCount;
            const satA = a.dailySearches > 0 ? a.videoCount / a.dailySearches : Infinity;
            const satB = b.dailySearches > 0 ? b.videoCount / b.dailySearches : Infinity;
            return satA - satB;
        });
    }, [trends, savedTrends, sortBy, currentView]);

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;
        if (currentView === 'search' && !hasSearched) return (<div className="text-center py-16 px-6 bg-[#374151] rounded-lg text-[#F1F1F1]"><h2 className="text-2xl font-bold">Find Your Next Big Idea</h2><p className="mt-2 text-[#F1F1F1]/70 max-w-xl mx-auto">Adjust the filters above and click "Search" to uncover high-demand, low-competition topics on YouTube.</p></div>);
        if (currentView === 'search' && hasSearched && trends.length === 0) return (<div className="text-center py-16 px-6 bg-[#374151] rounded-lg text-[#F1F1F1]"><h2 className="text-2xl font-bold">No Results Found</h2><p className="mt-2 text-[#F1F1F1]/70 max-w-xl mx-auto">No topics matched your specific criteria. Try broadening your search filters, like using a lower minimum search volume or a higher saturation level.</p></div>);
        if (currentView === 'saved' && savedTrends.length === 0) return (<div className="text-center py-16 px-6 bg-[#374151] rounded-lg text-[#F1F1F1]"><h2 className="text-2xl font-bold">Your Idea Safe-House is Empty</h2><p className="mt-2 text-[#F1F1F1]/70 max-w-xl mx-auto">Go to the "Search" tab to find content gaps. Click the star icon on any idea to save it here for later.</p></div>);
        return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{sortedTrends.map((t, i) => <TrendCard key={t.term} trend={t} index={i} isSaved={savedTrends.some(s => s.term === t.term)} onSaveToggle={handleSaveToggle} />)}</div>);
    };

    return (
        <div className="text-[#F1F1F1]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Header {...{ selectedDate, onDateChange: setSelectedDate, niche, onNicheChange: setNiche, onSearch: handleSearch, searchVolume, onSearchVolumeChange: setSearchVolume, saturationLevel, onSaturationLevelChange: setSaturationLevel, sortBy, onSortByChange: setSortBy, currentView, onViewChange: setCurrentView, savedTrendsCount: savedTrends.length }} />
                <main className="mt-8">{renderContent()}</main>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { 
                    animation: fade-in 0.5s ease-out forwards;
                    animation-fill-mode: backwards;
                }
             `}</style>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
