import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import ThemeToggle from './ThemeToggle';
import styles from '../../page.module.css';
import { CategoriesEnum } from '@/app/helpers/constants';

function getNavItemText(item) {
  switch (item) {
    case CategoriesEnum.games:
      return 'Ігри';
    case CategoriesEnum.music:
      return 'Музика';
    case CategoriesEnum.movies:
      return 'Фільми';
    default:
      return item.charAt(0).toUpperCase() + item.slice(1);
  }
}

export default function Header({
  isDarkTheme,
  setIsDarkTheme,
  category,
  setCategory,
}) {
  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  // Определяем цвета для обычного состояния и активного
  const getLinkColor = (isActive) => {
    if (isActive) {
      return isDarkTheme ? '#00D4FF' : '#FF6F61'; // Цвет для активного элемента
    }
    return isDarkTheme ? '#ffffff' : '#333333'; // Цвет для неактивного элемента
  };

  return (
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
          />
        </Tilt>
      </motion.div>
      <nav className={styles.nav}>
        {Object.values(CategoriesEnum).map((item) => {
          const isActive = category === item;
          return (
            <motion.a
              key={item}
              href="#"
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                color: getLinkColor(isActive), // Устанавливаем цвет через animate
              }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                color: isDarkTheme ? '#00D4FF' : '#FF6F61', // Цвет при наведении
              }}
              onClick={(e) => {
                e.preventDefault();
                setCategory(item);
              }}
            >
              {getNavItemText(item)}
            </motion.a>
          );
        })}
      </nav>
      <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
    </header>
  );
}
