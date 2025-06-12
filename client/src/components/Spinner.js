import { motion } from 'framer-motion';

const Spinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center items-center h-64"
    role="status"
    aria-label="Loading"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[var(--primary)]"></div>
  </motion.div>
);

export default Spinner;