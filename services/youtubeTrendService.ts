import { YouTubeTrend, ContentIdeas } from '../types';

const handleApiError = (error: unknown, context: string): never => {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error) {
        // Pass the server's error message to the client
        throw new Error(error.message);
    }
    throw new Error(`An unknown error occurred during ${context}.`);
}

/**
 * Fetches a list of high-demand, low-saturation YouTube search terms from our backend API.
 * @param {string} selectedDate - The date to fetch trends for, in YYYY-MM-DD format.
 * @param {string} niche - The optional user-defined niche to filter topics by.
 * @param {string} searchVolume - The minimum daily search volume.
 * @param {string} saturationLevel - The maximum saturation ratio (videoCount / dailySearches).
 * @returns {Promise<YouTubeTrend[]>} A promise that resolves to an array of YouTube trends.
 */
export const fetchYouTubeTrends = async (selectedDate: string, niche: string, searchVolume: string, saturationLevel: string): Promise<YouTubeTrend[]> => {
    try {
        const response = await fetch('/api/trends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'fetchTrends',
                payload: { selectedDate, niche, searchVolume, saturationLevel }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch trends.');
        }

        return data as YouTubeTrend[];
    } catch (error) {
        handleApiError(error, 'fetching YouTube trends');
        throw error;
    }
};

/**
 * Generates content ideas for a given YouTube search term from our backend API.
 * @param {string} term - The search term to generate ideas for.
 * @returns {Promise<ContentIdeas>} A promise that resolves to an object with titles and an outline.
 */
export const generateContentIdeas = async (term: string): Promise<ContentIdeas> => {
    try {
        const response = await fetch('/api/trends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generateIdeas',
                payload: { term }
            }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to generate content ideas.');
        }

        return data as ContentIdeas;
    } catch (error) {
        handleApiError(error, 'generating content ideas');
        throw error;
    }
}
