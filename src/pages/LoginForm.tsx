import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';

const LoginForm: React.FC = () => {
  const { updateUserData } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(''); // Fixed: changed setotp to setOtp
  const [errors, setErrors] = useState({ name: '', dob: '', phone: '', otp: '' }); // Fixed: added otp property
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', dob: '', phone: '', otp: '' }; // Fixed: added otp property

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required';
      valid = false;
    }

    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
      valid = false;
    }
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = 'Valid 6-digit Unique code is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    
    try {
      // First verify the unique code
      const verifyCodeResponse = await axios.post<{success: boolean; message?: string}>(`${import.meta.env.VITE_API_URL}/api/unique-code/verify`, {
        code: otp
      });

      if (!verifyCodeResponse.data.success) {
        setErrors(prev => ({ ...prev, otp: verifyCodeResponse.data.message || 'Invalid unique code' }));
        setLoading(false);
        return;
      }

      // Submit user data
      await axios.post(`${import.meta.env.VITE_API_URL}/api/submit`, {
        name,
        dob,
        phone,
        otp
      });

      // Update context and navigate
      updateUserData({ name, dob, phone });
      setTimeout(() => {
        navigate("/create-mpin");
        setLoading(false);
      }, 1500);

    } catch (error: any) {
      setLoading(false);
      setErrors(prev => ({ 
        ...prev, 
        otp: error.response?.data?.message || 'An error occurred during submission'
      }));
      console.error("Submission failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <h1 className="text-4xl font-bold mb-2 text-center">Login</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">Login to your account</p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <input
            type="text" 
            placeholder="Name On Aadhar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : 'border-gray-300'} placeholder-black`} // Fixed: added proper classes
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={`border p-2 rounded w-full ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>

        <div className="relative">
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            className={`border p-2 rounded w-full ${errors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-black`} // Fixed: added proper classes
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          <div className="absolute right-3 bottom-3 text-sm text-gray-500">
            {phone.length}/10
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Unique code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)} // Fixed: changed setotp to setOtp
            maxLength={6}
            className={`border p-2 rounded w-full ${errors.otp ? 'border-red-500' : 'border-gray-300'} placeholder-black`} // Fixed: added proper classes
          />
          {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
        </div>

        <button type="submit" className="primary-button w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="small" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default LoginForm;