export interface YouTubeTrend {
  term: string;
  dailySearches: number;
  videoCount: number;
}

export type SortOption = 'dailySearches' | 'saturation' | 'videoCount';

export interface ContentIdeas {
    titles: string[];
    outline: string;
}

export type ViewOption = 'search' | 'saved';