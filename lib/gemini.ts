import { GoogleGenAI } from '@google/genai';

// Initialize the GoogleGenAI instance for server-side endpoints
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const TUTOR_MODEL = 'gemini-3.8-flash';
