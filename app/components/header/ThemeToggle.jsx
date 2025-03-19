import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';

const ThemeToggle = ({ isDarkTheme, toggleTheme }) => (
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
      className={`${styles.themeSlider} ${
        isDarkTheme ? styles.darkSlider : styles.lightSlider
      }`}
      initial={{ x: -20 }}
      animate={{ x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15,
        duration: 0.3,
      }}
    >
      <span className={styles.themeIcon}>
        <FontAwesomeIcon icon={faSun} />
      </span>
      <span className={styles.themeIcon}>
        <FontAwesomeIcon icon={faMoon} />
      </span>
    </motion.span>
  </motion.label>
);

export default ThemeToggle;
