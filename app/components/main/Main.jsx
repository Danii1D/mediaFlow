import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import styles from '../../page.module.css';
import SearchInput from './SearchInput';
import RatingStars from './RatingStars';

const Main = ({ catalogItems, isDarkTheme }) => {
  return (
    <main className={styles.main}>
      <SearchInput isDarkTheme={isDarkTheme} className={styles.search} />
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
            <Tilt
              key={item.key}
              className={styles.tiltCard}
              options={{ max: 15, scale: 1.02, speed: 200 }}
            >
              <motion.div
                className={styles.card}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: 3,
                  boxShadow: `0 15px 30px ${
                    isDarkTheme
                      ? 'rgba(0, 212, 255, 0.5)'
                      : 'rgba(255, 111, 97, 0.5)'
                  }`,
                }}
                transition={{ type: 'spring', stiffness: 200, duration: 0.3 }}
              >
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.ratingStars}>
                  <RatingStars rating={item.rating} />
                </div>
                <img
                  className={
                    item.type === 'Фільм'
                      ? styles.poster
                      : item.type === 'Музика'
                      ? styles.musicPoster
                      : styles.gamePoster
                  }
                  src={item.poster}
                  alt={item.title}
                  onError={(e) =>
                    console.log(
                      `Error loading ${item.type.toLowerCase()} poster:`,
                      e
                    )
                  }
                />
              </motion.div>
            </Tilt>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default Main;
