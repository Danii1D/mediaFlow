import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';

const RatingStars = ({ rating }) => {
  if (!rating || isNaN(rating)) return null;

  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1 ? 0.5 : 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={styles.ratingStars}>
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <FontAwesomeIcon
            key={`full-${i}`}
            icon={faStar}
            className={styles.fullStar}
          />
        ))}
      {halfStar === 0.5 && (
        <FontAwesomeIcon
          key="half"
          icon={faStarHalf}
          className={styles.halfStar}
        />
      )}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <FontAwesomeIcon
            key={`empty-${i}`}
            icon={faStar}
            className={styles.emptyStar}
          />
        ))}
    </div>
  );
};

export default RatingStars;
