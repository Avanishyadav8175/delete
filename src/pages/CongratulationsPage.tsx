import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AmexCard from '../components/AmexCard';
import { motion } from 'framer-motion';

const CongratulationsPage: React.FC = () => {
  const { userData, updateUserData } = useAppContext();
  const navigate = useNavigate();
  const [creditLimit, setCreditLimit] = useState(userData.creditLimit.toString());
  
  const handleSubmit = () => {
    updateUserData({ creditLimit: parseInt(creditLimit) });
    navigate('/card-details');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="mb-6 w-full">
        <AmexCard name={userData.name} />
      </div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full bg-gray-200 p-6 rounded-lg mb-6"
      >
        <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
        
        <p className="text-lg mb-4">
          Here is your life time free American Express credit card offer
        </p>
        
        <h2 className="text-xl font-semibold mb-2">Assured Credit Limit</h2>
        <p className="text-2xl font-bold mb-4">₹{parseInt(creditLimit).toLocaleString()}</p>
        
        <p className="mb-6">zero annual charges, 50,000+ worth of bonus</p>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Enter Current Limit"
            value={creditLimit}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCreditLimit(value);
            }}
            className="bg-white"
          />
          
          <button 
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ae265f]        text-white px-4 py-2 rounded-full"
          >
            Get Credit Limit
          </button>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">No Hidden Charges</h3>
        
        <p className="text-sm">
          Get a renewal fee waiver on eligible spends of ₹20,000 and above in the previous year of card membership
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CongratulationsPage;