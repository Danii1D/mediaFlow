import { NextResponse } from 'next/server';
import axios from 'axios';
import getDefoultPosterLink from '../helpers/PosterNotFound';

export async function GET() {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Spotify API credentials are missing' },
      { status: 500 }
    );
  }

  try {
    console.log('Attempting to get Spotify access token...');
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    console.log(
      'Spotify access token received:',
      tokenResponse.data.access_token
    );
    const accessToken = tokenResponse.data.access_token;

    let tracks = [];
    try {
      console.log(
        'Fetching tracks from Spotify playlist 37i9dQZF1DXcBWIGoYBM5M...'
      );
      const playlistResponse = await axios.get(
        'https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 10,
            market: 'UA',
          },
        }
      );

      tracks = playlistResponse.data.items.map((item) => ({
        id: item.track.id,
        title: item.track.name,
        cover:
          item.track.album.images?.[0]?.url ||
          'https://via.placeholder.com/500',
        rating: 0,
        overview: item.track.album.name || 'Опис відсутній',
      }));
    } catch (playlistError) {
      console.error(
        'Error fetching playlist 37i9dQZF1DXcBWIGoYBM5M:',
        playlistError.message
      );

      console.log('Attempting to search for popular tracks on Spotify...');
      const searchResponse = await axios.get(
        'https://api.spotify.com/v1/search',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: 'popular',
            type: 'track',
            limit: 10,
            market: 'UA',
          },
        }
      );

      tracks = searchResponse.data.tracks.items.map((track) => ({
        id: track.id,
        title: track.name,
        cover:
          track.album.images?.[0]?.url ||
          getDefoultPosterLink('500', `${track.name} Without poster(`),
        rating: 0,
        overview: track.album.name || 'Опис відсутній',
      }));
    }

    console.log('Music data to return:', tracks);
    return NextResponse.json(tracks, { status: 200 });
  } catch (error) {
    console.error('Error fetching music from Spotify:', {
      message: error.message,
      response: error.response?.data || error.response?.status,
    });
    return NextResponse.json(
      { error: 'Failed to fetch music from Spotify', details: error.message },
      { status: 500 }
    );
  }
}
