import { motion } from 'framer-motion';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-[var(--background)] py-6 mt-auto"
  >
    <div className="container text-center text-gray-500 dark:text-gray-400">
      <p>© {new Date().getFullYear()} Budget Planner. All rights reserved.</p>
    </div>
  </motion.footer>
);

export default Footer;