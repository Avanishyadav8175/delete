import React from 'react';
import { useAppContext } from '../context/AppContext';
import AmexCard from '../components/AmexCard';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FinalCongratulations: React.FC = () => {
  const { userData } = useAppContext();

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
        className="w-full flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mb-6 text-green-500"
        >
          <CheckCircle size={80} strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4 text-center">Congratulations!</h1>
        
        <p className="text-lg text-center mb-8">
          Your application has been received and is being processed. Your American Express card will be delivered soon.
        </p>
        
        <div className="bg-gray-100 w-full p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Card Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-gray-600">Credit Limit:</div>
              <div className="font-semibold">₹{userData.creditLimit.toLocaleString()}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-600">Annual Fee:</div>
              <div className="font-semibold">₹0</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-600">Card Type:</div>
              <div className="font-semibold">Platinum</div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 w-full p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Welcome Bonus</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="text-blue-500 mr-2">•</div>
              <div>10,000 membership reward points on your first purchase</div>
            </li>
            <li className="flex items-start">
              <div className="text-blue-500 mr-2">•</div>
              <div>Complimentary airport lounge access</div>
            </li>
            <li className="flex items-start">
              <div className="text-blue-500 mr-2">•</div>
              <div>Dining privileges at premium restaurants</div>
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinalCongratulations;