import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Building, DollarSign, ExternalLink, Star } from 'lucide-react';

interface Deal {
  type: 'flight' | 'hotel';
  name: string;
  price: number;
  link: string;
  details: {
    [key: string]: string | number;
  };
}

interface AffiliateDealsProps {
  deals: Deal[];
}

const AffiliateDeals: React.FC<AffiliateDealsProps> = ({ deals }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {deals.map((deal, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {deal.type === 'flight' ? (
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="text-blue-600" size={24} />
                </div>
              ) : (
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building className="text-green-600" size={24} />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{deal.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {Object.entries(deal.details).map(([key, value], i) => (
                    <React.Fragment key={key}>
                      {i > 0 && <span>•</span>}
                      <span>{value}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                <DollarSign size={20} />
                {deal.price}
              </div>
              <motion.a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-1"
              >
                View Deal
                <ExternalLink size={14} />
              </motion.a>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AffiliateDeals;