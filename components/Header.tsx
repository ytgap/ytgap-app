import React from 'react';
import { SortOption, ViewOption } from '../types';
import Logo from './Logo';

const inputStyles = "bg-brand-light-dark border border-brand-off-white/20 text-brand-off-white text-sm rounded-lg focus:ring-brand-red focus:border-brand-red block w-full p-2.5 placeholder-gray-400";

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  niche: string;
  onNicheChange: (niche: string) => void;
  onSearch: () => void;
  searchVolume: string;
  onSearchVolumeChange: (value: string) => void;
  saturationLevel: string;
  onSaturationLevelChange: (value: string) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  currentView: ViewOption;
  onViewChange: (view: ViewOption) => void;
  savedTrendsCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
    selectedDate, onDateChange, 
    niche, onNicheChange, 
    onSearch,
    searchVolume, onSearchVolumeChange,
    saturationLevel, onSaturationLevelChange,
    sortBy, onSortByChange,
    currentView, onViewChange, savedTrendsCount
 }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
    
  return (
    <header className="border-b-2 border-brand-light-dark pb-8 space-y-8">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Logo />
        <p className="text-lg text-brand-off-white/70 -mt-2">
            Find what's wanted. Create what's missing.
        </p>
      </div>
      
      {/* View Toggle */}
      <div className="flex justify-center">
          <div className="relative inline-flex bg-brand-light-dark p-1 rounded-lg">
            <button onClick={() => onViewChange('search')} className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'search' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                Search
            </button>
            <button onClick={() => onViewChange('saved')} className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${currentView === 'saved' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                My Saved Ideas
                {savedTrendsCount > 0 && (
                    <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{savedTrendsCount}</span>
                )}
            </button>
            <div className={`absolute top-1 bottom-1 bg-brand-red/50 rounded-md transition-all duration-300 ease-in-out`} style={{
                width: currentView === 'search' ? 'calc(50% - 4px)' : 'calc(50% - 4px)',
                left: currentView === 'search' ? '4px' : '50%',
                transform: currentView === 'search' ? 'translateX(0)' : 'translateX(0)',
                minWidth: '100px'
            }}></div>
          </div>
      </div>

      {/* Search Filters (conditionally rendered) */}
      {currentView === 'search' && (
      <div className="space-y-4 animate-fade-in">
        {/* Row 1: Main Search */}
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
            <div className="w-full sm:w-auto">
               <label htmlFor="date-picker" className="block mb-2 text-sm font-medium text-brand-off-white/70">Date</label>
               <input id="date-picker" type="date" value={selectedDate} onChange={(e) => onDateChange(e.target.value)} className={inputStyles} aria-label="Select date"/>
            </div>
            <div className="w-full sm:w-auto sm:flex-grow max-w-xs">
                <label htmlFor="niche-input" className="block mb-2 text-sm font-medium text-brand-off-white/70">Niche (Optional)</label>
                <input id="niche-input" type="text" value={niche} onChange={(e) => onNicheChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., 'vintage synths'" className={inputStyles} aria-label="Enter niche"/>
            </div>
            <div className="w-full sm:w-auto">
                <button onClick={onSearch} className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-300" aria-label="Search for opportunities">
                    Search
                </button>
            </div>
        </div>

        {/* Row 2: Advanced Filters */}
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 pt-4">
            <div className="w-full sm:w-auto">
                <label htmlFor="search-volume" className="block mb-2 text-sm font-medium text-brand-off-white/70">Min. Search Volume</label>
                <select id="search-volume" value={searchVolume} onChange={e => onSearchVolumeChange(e.target.value)} className={inputStyles} aria-label="Minimum search volume">
                    <option value="10000">10,000</option>
                    <option value="50000">50,000</option>
                    <option value="100000">100,000</option>
                    <option value="500000">500,000</option>

                </select>
            </div>
            <div className="w-full sm:w-auto">
                <label htmlFor="saturation-level" className="block mb-2 text-sm font-medium text-brand-off-white/70">Max. Saturation</label>
                <select id="saturation-level" value={saturationLevel} onChange={e => onSaturationLevelChange(e.target.value)} className={inputStyles} aria-label="Maximum content saturation">
                    <option value="0.05">< 5%</option>
                    <option value="0.01">< 1%</option>
                    <option value="0.001">< 0.1%</option>
                    <option value="0.0001">< 0.01%</option>
                </select>
            </div>
             <div className="w-full sm:w-auto">
                <label htmlFor="sort-by" className="block mb-2 text-sm font-medium text-brand-off-white/70">Sort By</label>
                <select id="sort-by" value={sortBy} onChange={e => onSortByChange(e.target.value as SortOption)} className={inputStyles} aria-label="Sort results by">
                    <option value="dailySearches">Highest Searches</option>
                    <option value="saturation">Lowest Saturation</option>
                    <option value="videoCount">Lowest Video Count</option>
                </select>
            </div>
        </div>
      </div>
      )}
      <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-in-out;
          }
      `}</style>
    </header>
  );
};

export default Header;
