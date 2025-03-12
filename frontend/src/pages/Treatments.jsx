import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaNotesMedical, FaUserMd, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdSick } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddTreatment from '../components/AddTreatment';
import UpdateTreatment from '../components/UpdateTreatment';
import { motion } from 'framer-motion';

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [doctorNames, setDoctorNames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Add animation variants
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
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const fetchDoctorName = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
     

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      
      return response.data.fullName;
    } catch (err) {
      console.error('Error fetching doctor:', err.response || err);
      return 'Unknown Doctor';
    }
  };

  const fetchTreatments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view treatments');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/treatments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const treatmentsData = response.data.data;
     

      const doctorIds = [...new Set(treatmentsData.map(t => t.doctor))];
     

      const names = {};
      
      await Promise.all(
        doctorIds.map(async (id) => {
          names[id] = await fetchDoctorName(id);
        })
      );

    
      setDoctorNames(names);
      setTreatments(treatmentsData);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Failed to fetch treatments');
      
      if(err.response?.data?.message === "Invalid token"){
        navigate('/login');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const filteredTreatments = treatments.filter(treatment =>
    treatment.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSuccess = () => {
    fetchTreatments();
  };

  const handleUpdateSuccess = () => {
    fetchTreatments();
    setSelectedTreatment(null);
  };

  const handleDeleteTreatment = async (treatmentId) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/treatment/${treatmentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setTreatments(treatments.filter(treatment => treatment._id !== treatmentId));
        setSelectedTreatment(null);
      } catch (err) {
        console.error('Error deleting treatment:', err);
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
            placeholder="Search treatments by disease..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
          <FaNotesMedical className="mr-3 text-blue-500" />
          Treatment Records
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
        >
          <FaPlus className="mr-2" />
          Add Treatment
        </button>
      </div>

      {/* Treatments Grid */}
      {loading ? (
        <div className="text-white text-center">Loading treatments...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTreatments.map((treatment) => (
            <motion.div
              key={treatment._id}
              onClick={() => setSelectedTreatment(treatment)}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition duration-300"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <MdSick className="text-blue-500 text-2xl mr-3" />
                  <h3 className="text-xl font-semibold text-white">{treatment.disease}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTreatment(treatment._id);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Treatment"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </div>
              </div>
              <div className="text-gray-300 space-y-2">
                <p className="flex items-center">
                  <GiMedicines className="mr-2" />
                  {treatment.medication}
                </p>
                <p className="flex items-center">
                  <FaUserMd className="mr-2" />
                  Dr. {doctorNames[treatment.doctor] || 'Loading...'}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Treatment Detail Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center mb-6">
                <FaNotesMedical className="text-blue-500 text-3xl mr-4" />
                <h2 className="text-2xl font-bold text-white">{selectedTreatment.disease}</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  <FaEdit className="text-xl" />
                </button>
                <button
                  onClick={() => handleDeleteTreatment(selectedTreatment._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <FaTrash className="text-xl" />
                </button>
                <button
                  onClick={() => setSelectedTreatment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 text-gray-300">
              <div className="space-y-4">
                <div className="flex items-center">
                  <GiMedicines className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Medication</p>
                    <p>{selectedTreatment.medication}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUserMd className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Doctor</p>
                    <p>Dr. {doctorNames[selectedTreatment.doctor] || 'Loading...'}</p>
                  </div>
                </div>

                {selectedTreatment.description && (
                  <div className="flex items-start">
                    <FaNotesMedical className="text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Description</p>
                      <p>{selectedTreatment.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Treatment Modal */}
      <AddTreatment
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Update Treatment Modal */}
      <UpdateTreatment
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        treatment={selectedTreatment}
      />
    </div>
  );
}

export default Treatments;
