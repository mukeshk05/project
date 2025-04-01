import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthButtons: React.FC = () => {
  const buttonVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const iconVariants = {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    hover: {
      rotate: [0, -15, 15, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={buttonVariants}
        transition={{ delay: 0.2 }}
      >
        <Link to="/login">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            <motion.span variants={iconVariants}>
              <LogIn size={20} />
            </motion.span>
            <span>Login</span>
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={buttonVariants}
        transition={{ delay: 0.3 }}
      >
        <Link to="/register">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <motion.span variants={iconVariants}>
              <UserPlus size={20} />
            </motion.span>
            <span>Register</span>
            <motion.div
              className="absolute inset-0 bg-white rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 4, opacity: 0.2 }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default AuthButtons;