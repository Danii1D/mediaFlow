import { NextResponse } from 'next/server';
import getDefoultPosterLink from '../../helpers/PosterNotFound';

export async function GET() {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;
  if (!RAWG_API_KEY) {
    return NextResponse.json(
      { error: 'Rawg API key is missing' },
      { status: 500 }
    );
  }

  try {
    console.log('Fetching games from Rawg...');
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&dates=2020-01-01,2025-01-01&page_size=10`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch games from Rawg: Status ${response.status}`
      );
    }
    const data = await response.json();
    console.log('Rawg API response:', data);

    const games = data.results.map((game) => ({
      id: game.id,
      title: game.name,
      cover:
        game.background_image ||
        getDefoultPosterLink('500', `${game.name} Without poster(`),
      rating: game.rating || 0,
      overview: game.description || 'Опис відсутній',
    }));

    console.log('Games data to return:', games);
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error('Error fetching games from Rawg:', {
      message: error.message,
      response: error.response?.data || error.response?.status,
    });
    return NextResponse.json(
      { error: 'Failed to fetch games from Rawg', details: error.message },
      { status: 500 }
    );
  }
}
