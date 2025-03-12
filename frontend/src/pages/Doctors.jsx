import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserMd, FaEnvelope, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view doctors');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDoctors(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Failed to fetch doctors');
      
      if(err.response?.data?.message === "Invalid token"){
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <FaUserMd className="mr-3 text-blue-500" />
          Our Medical Team
        </h1>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="text-white text-center">Loading doctors...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor._id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUserMd className="text-6xl text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Dr. {doctor.fullName}
                  </h3>
                  <p className="text-blue-400 mb-4 uppercase text-sm tracking-wider">
                    {doctor.role || 'Medical Doctor'}
                  </p>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center justify-center">
                      <FaEnvelope className="mr-2 text-blue-500" />
                      {doctor.email}
                    </p>
                    <p className="flex items-center justify-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      Joined {formatDate(doctor.joinedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Doctors; 