import React from 'react';
import { Link } from 'react-router-dom';
import { History, MessageSquare, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationCenter from './NotificationCenter';
import { User } from '../types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const menuVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
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
    <motion.div
      initial="initial"
      animate="animate"
      variants={menuVariants}
      className="flex items-center gap-4"
    >
      <motion.div
        variants={menuVariants}
        className="flex items-center gap-2 text-gray-600"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span>Welcome, {user.name}</span>
      </motion.div>

      <NotificationCenter />

      <Link to="/bookings">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <motion.span variants={iconVariants}>
            <History size={20} />
          </motion.span>
          My Bookings
        </motion.button>
      </Link>

      <Link to="/assistant">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
        >
          <motion.span variants={iconVariants}>
            <MessageSquare size={20} />
          </motion.span>
          Travel Assistant
        </motion.button>
      </Link>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onLogout}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        <motion.span variants={iconVariants}>
          <LogOut size={20} />
        </motion.span>
        Logout
      </motion.button>
    </motion.div>
  );
};

export default UserMenu;