// pages/Home.jsx
'use client';
import { useState, useEffect } from 'react';
import Particles from 'react-particles';
import { useSpring } from 'react-spring';
import { gsap } from 'gsap';
import { faFilm, faMusic, faGamepad } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';
import axios from 'axios';

import { CategoriesEnum } from './helpers/constants';
import Header from './components/header/Header';
import Main from './components/main/Main';

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [movies, setMovies] = useState([]);
  const [music, setMusic] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(CategoriesEnum.movies);

  // console.log('render', CategoriesEnum, category);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesResp, musicResp, gamesResp] = await Promise.all([
          axios.get('/api/movies'),
          axios.get('/api/music'),
          axios.get('/api/games'),
        ]);
        setMovies(moviesResp.data || []);
        setMusic(musicResp.data || []);
        setGames(gamesResp.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Анимация при смене темы
  useEffect(() => {
    gsap.to('.container', {
      background: isDarkTheme ? '#000000' : '#ffffff',
      color: isDarkTheme ? '#ffffff' : '#000000',
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to('.particles canvas', {
          background: 'transparent',
          duration: 0,
        });
        gsap.to('.particles', {
          scale: 1.1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      },
    });
  }, [isDarkTheme]);

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 100,
  });

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  const getCatalogItems = () => {
    // console.log('Current category:', category);
    // console.log('Movies data:', movies);
    // console.log('Music data:', music);
    // console.log('Games data:', games);

    switch (category) {
      case CategoriesEnum.music:
        return music.map((track, index) => ({
          ...track,
          type: 'Музика',
          icon: faMusic,
          key: track.id || `music-${index}`,
          title: track.title,
          poster: track.cover,
          rating: track.rating || 0,
          overview: track.overview || 'Опис відсутній',
        }));
      case CategoriesEnum.games:
        return games.map((game, index) => ({
          ...game,
          type: 'Гра',
          icon: faGamepad,
          key: game.id || `game-${index}`,
          title: game.title,
          poster: game.cover,
          rating: game.rating || 0,
          overview: game.overview || 'Опис відсутній',
        }));
      default:
        return movies.map((movie, index) => ({
          ...movie,
          type: 'Фільм',
          icon: faFilm,
          key: movie.id || `movie-${index}`,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating || 0,
          overview: movie.overview || 'Опис відсутній',
        }));
    }
  };

  const catalogItems = getCatalogItems();

  return (
    <div
      className={`${styles.container} ${
        isDarkTheme ? styles.dark : styles.light
      }`}
    >
      <Particles
        className={styles.particles}
        params={{
          particles: {
            number: { value: 80 },
            size: { value: 4 },
            move: { speed: 0.7 },
            color: { value: isDarkTheme ? '#00D4FF' : '#FF6F61' },
            opacity: { value: 0.6 },
          },
        }}
      />
      <Header
        category={category}
        setCategory={setCategory}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
      />
      <Main catalogItems={catalogItems} isDarkTheme={isDarkTheme} />
    </div>
  );
}
