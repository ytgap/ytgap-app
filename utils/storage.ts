import { YouTubeTrend } from '../types';

const STORAGE_KEY = 'ytgap_savedTrends';

/**
 * Retrieves saved trends from localStorage.
 * @returns {YouTubeTrend[]} An array of saved trends, or an empty array if none are found or on error.
 */
export const getSavedTrends = (): YouTubeTrend[] => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
    } catch (error) {
        console.error("Failed to retrieve or parse saved trends from localStorage:", error);
    }
    return [];
};

/**
 * Saves an array of trends to localStorage.
 * @param {YouTubeTrend[]} trends - The array of trends to save.
 */
export const saveTrends = (trends: YouTubeTrend[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trends));
    } catch (error) {
        console.error("Failed to save trends to localStorage:", error);
    }
};