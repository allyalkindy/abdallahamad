// frontend/src/pages/SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaUserMd, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', { 
        email, 
        password, 
        fullName: name 
      });
      setSuccess(response.data.message);
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setSuccess('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="flex justify-center mb-4">
          <FaUserMd className="text-white text-4xl" />
        </div>
        <h2 className="text-white text-2xl font-bold text-center mb-6">Doctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="name">Name</label>
            <div className="flex items-center bg-gray-700 rounded">
              <FaUser className="text-white ml-2" />
              <input
                type="text"
                id="name"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-white ml-2 focus:outline-none mr-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;