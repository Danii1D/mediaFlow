'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import { Tilt } from 'react-tilt';
import { useSpring, animated } from 'react-spring';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faMusic, faGamepad, faSun, faMoon, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';
import axios from 'axios';

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [movies, setMovies] = useState([]);
  const [music, setMusic] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('movies');

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

    const fetchData = async () => {
      try {
        console.log('Fetching movies from /api/movies...');
        const moviesResp = await axios.get('/api/movies');
        console.log('Movies fetched:', moviesResp.data);
        setMovies(moviesResp.data || []);

        console.log('Fetching music from /api/music...');
        const musicResp = await axios.get('/api/music');
        console.log('Music fetched:', musicResp.data);
        setMusic(musicResp.data || []);

        console.log('Fetching games from /api/games...');
        const gamesResp = await axios.get('/api/games');
        console.log('Games fetched:', gamesResp.data);
        setGames(gamesResp.data || []);
      } catch (error) {
        console.error('Error fetching data:', {
          movies: error.response?.data || error.message,
          music: error.response?.data || error.message,
          games: error.response?.data || error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 100,
  });

  const getRatingStars = (rating) => {
    if (!rating || isNaN(rating)) return null;
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? 0.5 : 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className={styles.ratingStars}>
        {Array(fullStars).fill().map((_, i) => (
          <FontAwesomeIcon key={`full-${i}`} icon={faStar} className={styles.fullStar} />
        ))}
        {halfStar === 0.5 && <FontAwesomeIcon key="half" icon={faStarHalf} className={styles.halfStar} />}
        {Array(emptyStars).fill().map((_, i) => (
          <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className={styles.emptyStar} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  const getCatalogItems = () => {
    console.log('Current category:', category);
    console.log('Movies data:', movies);
    console.log('Music data:', music);
    console.log('Games data:', games);

    switch (category) {
      case 'movies':
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
      case 'music':
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
      case 'games':
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
    <div className={`${styles.container} ${isDarkTheme ? styles.dark : styles.light}`}>
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
      <header className={styles.header}>
        <motion.div
          className={styles.logoWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, type: 'spring' }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Tilt
            className={styles.tiltLogo}
            options={{ max: 25, scale: 1.05, speed: 300 }}
          >
            <img
              src={isDarkTheme ? '/logo-dark.png' : '/logo-light.png'}
              alt="MediaFlow Logo"
              className={styles.logo}
              onError={(e) => console.log('Error loading logo:', e)}
            />
          </Tilt>
        </motion.div>
        <nav className={styles.nav}>
          {['Фільми', 'Музика', 'Ігри'].map((item) => (
            <motion.a
              key={item}
              href="#"
              className={`${styles.navLink} ${category === item.toLowerCase() ? styles.active : ''}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{ scale: 1.05, color: isDarkTheme ? '#00D4FF' : '#FF6F61' }}
              onClick={(e) => { e.preventDefault(); setCategory(item.toLowerCase()); }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        <motion.label
          className={styles.themeToggle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <input
            type="checkbox"
            checked={isDarkTheme}
            onChange={toggleTheme}
            className={styles.themeCheckbox}
          />
          <motion.span
            className={`${styles.themeSlider} ${isDarkTheme ? styles.darkSlider : styles.lightSlider}`}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, duration: 0.3 }}
          >
            <span className={styles.themeIcon}>
              <FontAwesomeIcon icon={faSun} />
            </span>
            <span className={styles.themeIcon}>
              <FontAwesomeIcon icon={faMoon} />
            </span>
          </motion.span>
        </motion.label>
      </header>
      <main className={styles.main}>
        <motion.input
          type="text"
          placeholder="Скажи, що хочеш — я знайду!"
          className={styles.search}
          initial={{ width: '30%', opacity: 0 }}
          animate={{ width: '50%', opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          whileFocus={{ width: '55%', boxShadow: `0 0 20px ${isDarkTheme ? '#00D4FF' : '#FF6F61'}` }}
          whileHover={{ scale: 1.02 }}
        />
        <div className={styles.results}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Твій каталог
          </motion.h2>
          <motion.div
            className={styles.catalog}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {catalogItems.map((item) => (
              <Tilt key={item.key} className={styles.tiltCard} options={{ max: 15, scale: 1.02, speed: 200 }}>
                <motion.div
                  className={styles.card}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: 3,
                    boxShadow: `0 15px 30px ${isDarkTheme ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 111, 97, 0.5)'}`,
                  }}
                  transition={{ type: 'spring', stiffness: 200, duration: 0.3 }}
                >
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.ratingStars}>{getRatingStars(item.rating)}</div>
                  <img
                    className={
                      item.type === 'Фільм' ? styles.poster :
                      item.type === 'Музика' ? styles.musicPoster :
                      styles.gamePoster
                    }
                    src={item.poster}
                    alt={item.title}
                    onError={(e) => console.log(`Error loading ${item.type.toLowerCase()} poster:`, e)}
                  />
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}