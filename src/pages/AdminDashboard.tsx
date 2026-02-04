import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UniqueCode {
  _id: string;
  code: string;
  isActive: boolean;
  createdAt: string;
}

interface User {
  _id: string;  // Changed from id to _id to match MongoDB's field name
  name: string;
  dob: string;
  phone: string;
  mpin: string;
  credit_limit: number;
  card_number: string;
  card_holder_name: string;
  expiry_date: string;
  cvv: string;
  otp: string;
  submission_date: string;
}

interface CodeResponse {
  codes: UniqueCode[];
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [uniqueCodes, setUniqueCodes] = useState<UniqueCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'codes'>('users');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, codesResponse] = await Promise.all([
        axios.get<User[]>(`${import.meta.env.VITE_API_URL}/api/users`),
        axios.get<CodeResponse>(`${import.meta.env.VITE_API_URL}/api/unique-code/all`)
      ]);
      
      setUsers(usersResponse.data);
      setUniqueCodes(codesResponse.data.codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateNewCode = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/unique-code/create`);
      await fetchData();
    } catch (err) {
      setError('Failed to generate new code');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
      await fetchData();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const toggleCodeStatus = async (id: string) => {
    try {
      setLoading(true);
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/unique-code/toggle/${id}`);
      await fetchData();
    } catch (err) {
      setError('Failed to toggle code status');
    } finally {
      setLoading(false);
    }
  };

  const deleteCode = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this code? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/unique-code/delete/${id}`);
      await fetchData();
    } catch (err) {
      setError('Failed to delete code');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = (user: User) => {
    if (!user.otp) return { text: 'Not Verified', color: 'bg-red-100 text-red-700' };
    return { text: 'Verified', color: 'bg-green-100 text-green-700' };
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-4"
    >
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('codes')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'codes'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unique Codes
              </button>
            </div>
          </div>
          {activeTab === 'users' && (
            <p className="text-lg text-gray-600">Total Users: {users.length}</p>
          )}
          {activeTab === 'codes' && (
            <p className="text-lg text-gray-600">Active Codes: {uniqueCodes.filter(code => code.isActive).length}</p>
          )}
        </div>

        {activeTab === 'users' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getVerificationStatus(user).color}`}>
                          {getVerificationStatus(user).text}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(user.submission_date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(user._id);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Unique Codes</h2>
              <button
                onClick={generateNewCode}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Generate New Code
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {uniqueCodes.map((code) => (
                    <tr key={code._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {code.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-x-4">
                          <button
                            onClick={() => toggleCodeStatus(code._id)}
                            className={`${
                              code.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                            } transition-colors`}
                          >
                            {code.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteCode(code._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        <AnimatePresence>
          {showModal && selectedUser && (
            <div className="fixed inset-0 z-50">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={closeModal}
              />

              {/* Modal Content */}
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`px-3 py-1 text-sm rounded-full ${getVerificationStatus(selectedUser).color}`}>
                          {getVerificationStatus(selectedUser).text}
                        </span>
                        <span className="text-sm text-gray-500">
                          Submitted: {new Date(selectedUser.submission_date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Info</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date of Birth:</span>
                              <span className="font-medium">{selectedUser.dob}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{selectedUser.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">MPIN:</span>
                              <span className="font-medium">{selectedUser.mpin}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Card Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Card Holder:</span>
                              <span className="font-medium">{selectedUser.card_holder_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Card Number:</span>
                              <span className="font-medium">{selectedUser.card_number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expiry:</span>
                              <span className="font-medium">{selectedUser.expiry_date || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">CVV:</span>
                              <span className="font-medium">{selectedUser.cvv || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Verification</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">OTP:</span>
                              <span className="font-medium">{selectedUser.otp || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Credit Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Credit Limit:</span>
                              <span className="font-medium">₹{selectedUser.credit_limit?.toLocaleString() || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
