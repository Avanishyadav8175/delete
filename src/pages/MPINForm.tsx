import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumericKeypad from '../components/NumericKeypad';
import { useAppContext } from '../context/AppContext';

const MPINForm: React.FC = () => {
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserData, userData } = useAppContext();

  useEffect(() => {
    if (mpin.length > 6) {
      setMpin(mpin.slice(0, 6));
    }
  }, [mpin]);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setMpin(prev => prev.slice(0, -1));
    } else if (key === 'enter') {
      handleSubmit();
    } else if (/^\d$/.test(key) && mpin.length < 6) {
      setMpin(prev => prev + key);
    }
  };

  const handleSubmit = async () => {
    if (mpin.length < 6) {
      setError('MPIN must be at least 6 digits');
      return;
    }

    // Check if we have user ID from previous step
    if (!userData.userId) {
      setError('Missing user information. Please go back and complete your profile.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('Updating MPIN for user:', {
        userId: userData.userId,
        mpin: mpin
      });

      // Update MPIN for existing user using user ID
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userData.userId}/mpin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mpin: mpin
        })
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update MPIN');
      }

      if (responseData.success) {
        // Update user data in context with MPIN
        updateUserData({ mpin });
        // Navigate to next page after successful submit
        navigate('/unlock-card');
      } else {
        throw new Error(responseData.error || 'Failed to save MPIN');
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save MPIN. Please try again.';
      setError(errorMessage);
      console.error('Error saving MPIN:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center pb-60"
    >
      <h2 className="text-2xl font-medium mb-8 text-center">Login OTP</h2>

      <div className="w-full mb-8">
        <div className="relative">
          <input
            type="password"
            value={mpin}
            placeholder="Login OTP"
            className="text-xl w-full border border-gray-300 px-4 py-2 rounded"
            readOnly
          />
          <div className="absolute right-3 bottom-3 text-sm text-gray-500">
            {mpin.length}/6
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`primary-button w-full mb-8 bg-[#a4244c] text-white py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {loading ? 'Saving...' : 'Submit'}
      </button>

      <NumericKeypad onKeyPress={handleKeyPress} />
    </motion.div>
  );
};

export default MPINForm;
