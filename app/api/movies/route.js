import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key is missing' }, { status: 500 });
  }

  try {
    console.log('Fetching movies from TMDB...');
    const popularResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=uk-UA&page=1`
    );

    const movies = await Promise.all(
      popularResponse.data.results.map(async (movie) => {
        const detailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=uk-UA`
        );

        let overview = detailsResponse.data.overview || movie.overview;
        if (!overview || overview.includes('en')) {
          try {
            const translateResponse = await axios.post('/api/translate', { text: overview || 'No description available' });
            overview = translateResponse.data.translatedText;
          } catch (translateError) {
            console.error('Translation error for movie:', translateError);
            overview = overview || 'Опис відсутній';
          }
        }

        return {
          id: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average,
          overview: overview,
        };
      })
    );

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error('Error fetching movies from TMDB:', {
      message: error.message,
      response: error.response?.data || error.response?.status,
    });
    return NextResponse.json({ error: 'Failed to fetch movies from TMDB', details: error.message }, { status: 500 });
  }
}