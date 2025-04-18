import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingDown, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface FlexibleDate {
  date: Date;
  price: number;
}

interface FlexibleDateSuggestionsProps {
  dates: FlexibleDate[];
  onSelect: (date: Date) => void;
  currentPrice: number;
}

const FlexibleDateSuggestions: React.FC<FlexibleDateSuggestionsProps> = ({
  dates,
  onSelect,
  currentPrice,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const betterDeals = dates.filter(date => date.price < currentPrice)
    .sort((a, b) => a.price - b.price);

  if (betterDeals.length === 0) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-green-50 rounded-lg p-4 mt-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="text-green-600" size={20} />
        <h3 className="font-semibold text-green-800">Better Deals Available!</h3>
      </div>

      <div className="space-y-3">
        {betterDeals.slice(0, 3).map((deal, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-500" size={20} />
              <div>
                <p className="font-medium">{format(deal.date, 'MMM d, yyyy')}</p>
                <p className="text-sm text-gray-500">
                  Save ${(currentPrice - deal.price).toFixed(2)}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(deal.date)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <span>${deal.price}</span>
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FlexibleDateSuggestions;