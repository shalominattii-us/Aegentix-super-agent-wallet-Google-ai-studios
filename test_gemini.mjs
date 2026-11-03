import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function testGemini() {
  try {
    console.log('Testing gemini-3.8-flash...');
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'You are an autonomous quant trading agent. In 1 sentence, summarize Bitcoin consolidating near $80,000.',
    });
    console.log('SUCCESS! Gemini 3.8 Flash response:', res.text);
  } catch (err) {
    console.error('Gemini error:', err.message);
  }
}

testGemini();
