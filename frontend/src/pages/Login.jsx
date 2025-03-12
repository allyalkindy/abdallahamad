// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth`, { 
        email, 
        password 
      });
      
      if (response.data && response.data.data) {
        // Store just the token string
        localStorage.setItem('token', response.data.data);
        navigate('/welcome', { state: { fromLogin: true } });
      } else {
        setError('Login failed - No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="flex justify-center mb-4">
          <FaUserMd className="text-white text-4xl" />
        </div>
        <h2 className="text-white text-2xl font-bold text-center mb-6">Doctor Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <div className="flex items-center bg-gray-700 rounded">
              <FaEnvelope className="text-white ml-2" />
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <div className="flex items-center bg-gray-700 rounded">
              <FaLock className="text-white ml-2" />
              <input
                type="password"
                id="password"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


export default Login;