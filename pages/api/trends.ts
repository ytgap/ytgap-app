import { type NextApiRequest, type NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";
import { YouTubeTrend, ContentIdeas } from '../../types';

// This is a server-side only file.
// The API_KEY is securely accessed from environment variables.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (text: string) => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    return JSON.parse(jsonStr);
}


const fetchYouTubeTrendsFromAI = async (selectedDate: string, niche: string, searchVolume: string, saturationLevel: string): Promise<YouTubeTrend[]> => {
    const nicheInstruction = niche.trim()
        ? `The topics MUST be within the '${niche.trim()}' niche.`
        : 'The topics should be diverse and can come from any niche.';
    
    const parsedSearchVolume = parseInt(searchVolume, 10);

    const prompt = `
        Generate a list of up to 25 YouTube search topics for the specific date: ${selectedDate}.
        ${nicheInstruction}
        
        The topics must meet two specific criteria:
        1. The topic must have a high daily search volume, specifically over ${parsedSearchVolume} searches on that day.
        2. The topic must have an extremely low content saturation, meaning the ratio of existing videos to daily searches is less than ${saturationLevel} (videoCount / dailySearches < ${saturationLevel}).

        For each topic that meets these criteria, provide the search term, a realistic but fictional estimated daily searches for ${selectedDate}, and a realistic but fictional estimated total number of videos that exist for that search term.

        CRITICAL: Respond with ONLY a valid JSON array of objects.
        Each object in the array must have exactly three keys: 'term' (string), 'dailySearches' (number), and 'videoCount' (number).
        Do not include any other text, markdown, or explanations before or after the JSON array.
        If no topics match the strict criteria, you MUST return an empty JSON array: [].

        Example of a valid response:
        [
            {"term": "DIY solar-powered gadgets", "dailySearches": 150000, "videoCount": 75},
            {"term": "Beginner's guide to quantum computing", "dailySearches": 110000, "videoCount": 40}
        ]
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });

    const parsedData = parseJsonResponse(response.text);

    if (!Array.isArray(parsedData)) {
        throw new Error("Received malformed data from AI: expected an array.");
    }
    
    return parsedData as YouTubeTrend[];
};

const generateContentIdeasFromAI = async (term: string): Promise<ContentIdeas> => {
    const prompt = `
        You are a creative assistant for YouTube creators. A creator wants to make a video about the topic: "${term}".

        Your task is to provide creative, actionable ideas to help them get started.
        
        Please provide the following:
        1.  A list of exactly 5 click-worthy, engaging video titles.
        2.  A brief, sample video outline with a clear structure (e.g., Intro, Main Points, Conclusion).

        CRITICAL: Respond with ONLY a valid JSON object.
        The object must have exactly two keys: 'titles' (an array of 5 strings) and 'outline' (a single string with markdown for formatting).
        Do not include any other text, markdown, or explanations before or after the JSON object.

        Example of a valid response:
        {
            "titles": [
                "I Built a Solar-Powered Gadget and It Blew My Mind",
                "The ULTIMATE DIY Solar Gadget Guide (2024 Edition)",
                "Can You REALLY Power Gadgets with the Sun? Let's Find Out!",
                "5 Solar-Powered Gadgets You Can Build THIS Weekend",
                "Solar Power for Beginners: My First DIY Project"
            ],
            "outline": "### Video Outline: DIY Solar Gadgets\\n\\n**1. Intro Hook (0:00-0:30):**\\n   - Start with a dramatic shot of the final gadget working.\\n   - 'What if I told you that you could power your devices using just the sun, for under $20? Today, we're going to do exactly that.'\\n\\n**2. The Parts (0:30-1:30):**\\n   - Show a quick layout of all the components (small solar panel, battery, wires, etc.).\\n   - Briefly explain what each part does in simple terms.\\n\\n**3. The Build (1:30-4:00):**\\n   - A time-lapse or step-by-step guide of the assembly process.\\n   - Use on-screen text for key instructions or warnings.\\n\\n**4. The Test & Reveal (4:00-5:30):**\\n   - Take the gadget outside and show it charging/working.\\n   - Demonstrate its power (e.g., charging a phone, lighting an LED).\\n\\n**5. Conclusion & Call to Action (5:30-6:00):**\\n   - Recap the project's success.\\n   - 'If you enjoyed this project, hit that subscribe button and let me know in the comments what solar gadget I should build next!'"
        }
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.8,
        }
    });
    
    const parsedData = parseJsonResponse(response.text);

    if (typeof parsedData !== 'object' || parsedData === null || !Array.isArray(parsedData.titles) || typeof parsedData.outline !== 'string') {
             throw new Error("Received malformed data from API: object has incorrect shape.");
    }

    return parsedData as ContentIdeas;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;

        if (action === 'fetchTrends') {
            const { selectedDate, niche, searchVolume, saturationLevel } = payload;
            const trends = await fetchYouTubeTrendsFromAI(selectedDate, niche, searchVolume, saturationLevel);
            return res.status(200).json(trends);
        }

        if (action === 'generateIdeas') {
            const { term } = payload;
            const ideas = await generateContentIdeasFromAI(term);
            return res.status(200).json(ideas);
        }
        
        return res.status(400).json({ message: 'Invalid action specified.' });

    } catch (error) {
        console.error('API Route Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return res.status(500).json({ message: `Server error: ${errorMessage}` });
    }
}