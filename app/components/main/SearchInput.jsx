import { motion } from 'framer-motion';

const SearchInput = ({ isDarkTheme, className }) => {
  return (
    <motion.input
      type="text"
      placeholder="Скажи, що хочеш — я знайду!"
      className={className}
      initial={{ width: '30%', opacity: 0 }}
      animate={{ width: '50%', opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
      whileFocus={{
        width: '55%',
        boxShadow: `0 0 20px ${isDarkTheme ? '#00D4FF' : '#FF6F61'}`,
      }}
      whileHover={{ scale: 1.02 }}
    />
  );
};

export default SearchInput;
