import React from 'react';
import { motion } from 'framer-motion';
import cardImage from '../assets/Screenshot 2025-06-05 at 10.49.42 AM.png'; // your real card image

interface AmexCardProps {
  name?: string;       // Optional if you want to show holder name separately
  isActive?: boolean;  // You can use this to add glow or style later
}

const AmexCard: React.FC<AmexCardProps> = ({
}) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-2xl"
    >
      {/* Just show the image of the card */}
      <img
        src={cardImage}
        alt="AMEX Card"
        className="w-full h-auto object-cover"
      />
    </motion.div>
  );
};

export default AmexCard;
