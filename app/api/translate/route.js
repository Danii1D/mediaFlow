import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!GOOGLE_TRANSLATE_API_KEY) {
    return NextResponse.json({ error: 'Google Translate API key is missing' }, { status: 500 });
  }

  const { text } = await request.json();

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: 'uk',
        source: 'en',
      }
    );
    return NextResponse.json({ translatedText: response.data.data.translations[0].translatedText }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}