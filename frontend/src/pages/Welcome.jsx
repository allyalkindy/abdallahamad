import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaCamera, FaHospital, FaNotesMedical } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DefaultDoctorIcon } from '../components/DefaultDoctorIcon';

function Welcome() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const navigate = useNavigate();

  const fetchDoctorInfo = async () => {
    try {
      let token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      

      try {
        // Decode the token to get doctor ID
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const doctorId = decodedToken._id;
        

        const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

       
        setDoctor(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid, navigate to login
          navigate('/login');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Error fetching doctor info:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/doctor/upload-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload response:', response.data);
      
      if (response.data.doctor) {
        setDoctor(response.data.doctor);
        setShowFallback(false);
      } else {
        console.error('No doctor data in response');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setShowFallback(true);
    }
  };
 useEffect(() => {
    fetchDoctorInfo();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

 

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="relative h-48 bg-blue-500">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-800 overflow-hidden">
                  {doctor?.imageUrl && !showFallback ? (
                    <img 
                      src={ `http://localhost:5000/public/${doctor.imageUrl}`}
                      alt={doctor.fullName}
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.error('Image load error, falling back to default');
                        console.log('Failed URL:', doctor.imageUrl);
                        setShowFallback(true);
                      }}
                    />
                  ) : (
                    <DefaultDoctorIcon />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition">
                  <FaCamera className="text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome, Dr. {doctor?.fullName}
            </h1>
            <p className="text-gray-400 mb-6">
              {doctor?.email}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Link to="/patient-records">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700 p-6 rounded-xl cursor-pointer hover:bg-gray-600 transition"
                >
                  <FaHospital className="text-4xl text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Patient Records</h3>
                  <p className="text-gray-400">View and manage your patient records</p>
                </motion.div>
              </Link>

              <Link to="/treatments">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700 p-6 rounded-xl cursor-pointer hover:bg-gray-600 transition"
                >
                  <FaNotesMedical className="text-4xl text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Treatments</h3>
                  <p className="text-gray-400">Manage treatments and medications</p>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Welcome;
