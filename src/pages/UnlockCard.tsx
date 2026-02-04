import React from 'react';
import { useNavigate } from 'react-router-dom';
import AmexCard from '../components/AmexCard';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Gift, ChevronRight, CreditCard, TrendingUp, ShieldOff } from 'lucide-react';

const UnlockCard: React.FC = () => {
  const { userData } = useAppContext();
  const navigate = useNavigate();
  
  const handleApply = () => {
    navigate('/congratulations');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen p-4 bg-gray-50"
    >
      <div className="w-full max-w-md mx-auto">
        {/* Card Display */}
        <div className="mb-6">
          <AmexCard name={userData.name} />
        </div>
        
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Unlock Card Benefits</h1>
        
        {/* Benefits Summary */}
        <div className="flex justify-between w-full mb-6 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-center flex-1">
            <div className="text-green-600 font-semibold">₹0</div>
            <div className="text-xs text-gray-500">Annual Fee</div>
          </div>
          <div className="border-l border-gray-200 mx-2"></div>
          <div className="text-center flex-1">
            <div className="text-green-600 font-semibold">₹50,000</div>
            <div className="text-xs text-gray-500">Annual Benefits</div>
          </div>
        </div>
        
        {/* Card to Card Apply Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="flex items-center justify-center w-full mb-6 py-4 bg-[#ae265f] text-white rounded-xl font-medium shadow-md hover:bg-[#ae264f] transition-colors"
        >
          <CreditCard size={20} className="mr-2" />
          Card to Card Apply
        </motion.button>
        
        {/* Promotion Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 p-4 rounded-xl w-full flex items-center mb-6 border border-blue-100"
        >
          <div className="bg-blue-100 p-2 rounded-full">
            <Gift className="text-blue-600" size={20} />
          </div>
          <div className="flex-1 ml-3">
            <div className="font-medium text-blue-800">Get 10% off on your next purchase</div>
            <div className="text-xs text-blue-600 mt-1">Valid till 10th Oct 2024</div>
          </div>
          <ChevronRight className="text-blue-400" size={20} />
        </motion.div>
        
        {/* Limit Increase Section */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="flex items-center justify-center w-full mb-3 py-4 bg-white text-gray-800 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <TrendingUp size={20} className="mr-2 text-green-600" />
          Limit Increase
        </motion.button>
        <div className="text-gray-500 text-xs text-center mb-6">
          Minimum 2x increase, maximum depends on approval
        </div>
        
        {/* Deactivate Plans Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="flex items-center justify-center w-full mb-6 py-4 bg-white text-gray-800 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ShieldOff size={20} className="mr-2 text-red-500" />
          Deactivate Plans
        </motion.button>
        
        {/* Additional Info */}
        <div className="text-center text-gray-500 text-sm mb-16">
          <div className="mb-2">Cpp Plan (Card Protection Plan)</div>
          <div>Health insurance policy plan</div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around max-w-md mx-auto shadow-lg">
          {[
            { icon: <path d="M19 9L12 16L5 9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
            { icon: <><rect x="4" y="4" width="16" height="16" stroke="#666" strokeWidth="2"/><path d="M10 16V8L16 12L10 16Z" fill="#666"/></> },
            { icon: <><circle cx="12" cy="12" r="8" stroke="#666" strokeWidth="2"/><path d="M16 12H12M8 12H12M12 12V8M12 12V16" stroke="#666" strokeWidth="2" strokeLinecap="round"/></> },
            { icon: <><circle cx="12" cy="5" r="3" stroke="#666" strokeWidth="2"/><circle cx="5" cy="19" r="3" stroke="#666" strokeWidth="2"/><circle cx="19" cy="19" r="3" stroke="#666" strokeWidth="2"/><path d="M12 8V14M5 16L10 14M14 14L19 16" stroke="#666" strokeWidth="2"/></> }
          ].map((item, index) => (
            <button key={index} className="p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {item.icon}
              </svg>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UnlockCard;