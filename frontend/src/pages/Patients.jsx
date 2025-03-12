import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserInjured, FaSearch, FaTimes, FaPhoneAlt, FaNotesMedical, FaCalendarAlt, FaVenusMars, FaUserMd, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdSick } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddPatient from '../components/AddPatient';
import UpdatePatient from '../components/UpdatePatient';
import { motion } from 'framer-motion';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctorNames, setDoctorNames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

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
      console.error('Error fetching doctor:', err);
      return 'Unknown Doctor';
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view patients');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const patientsData = response.data.data;

      // Fetch doctor names for all patients
      const doctorIds = [...new Set(patientsData.map(p => p.assignedDoctor))];
      const names = {};
      
      await Promise.all(
        doctorIds.map(async (id) => {
          names[id] = await fetchDoctorName(id);
        })
      );

      setDoctorNames(names);
      setPatients(patientsData);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Failed to fetch patients');
      
      if(err.response?.data?.message === "Invalid token"){
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddSuccess = () => {
    fetchPatients();
  };

  const handleUpdateSuccess = () => {
    fetchPatients();
    setSelectedPatient(null);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/patient/${patientId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPatients(patients.filter(patient => patient._id !== patientId));
        setSelectedPatient(null);
      } catch (err) {
        console.error('Error deleting patient:', err);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Added Heading */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
          <FaUserInjured className="mr-3 text-blue-500" />
          Patients Record
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
        >
          <FaUserPlus className="mr-2" />
          Add Patient
        </button>
      </div>

      {/* Update Patients Grid */}
      {loading ? (
        <div className="text-white text-center">Loading patients...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient._id}
              onClick={() => setSelectedPatient(patient)}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition duration-300"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <FaUserInjured className="text-blue-500 text-2xl mr-3" />
                  <h3 className="text-xl font-semibold text-white">{patient.fullName}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(patient._id);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Patient"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </div>
              </div>
              <div className="text-gray-300 space-y-2">
                <p className="flex items-center">
                  <MdSick className="mr-2" />
                  {patient.disease}
                </p>
                <p className="flex items-center">
                  <FaUserMd className="mr-2" />
                  Dr. {doctorNames[patient.assignedDoctor] || 'Loading...'}
                </p>
                <p className="flex items-center">
                  <FaPhoneAlt className="mr-2" />
                  {patient.patientPhone}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <FaUserInjured className="text-blue-500 text-3xl mr-4" />
                <h2 className="text-2xl font-bold text-white">{selectedPatient.fullName}</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  <FaEdit className="text-xl" />
                </button>
                <button
                  onClick={() => handleDeletePatient(selectedPatient._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <FaTrash className="text-xl" />
                </button>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaVenusMars className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Gender</p>
                    <p>{selectedPatient.gender}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Date of Birth</p>
                    <p>{formatDate(selectedPatient.dateOfBirth)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MdSick className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Disease</p>
                    <p>{selectedPatient.disease}</p>
                  </div>
                </div>

                {/* Add Treatments Section */}
                <div className="flex items-start">
                  <GiMedicines className="text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Treatments</p>
                    <p>{selectedPatient.treatments}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUserMd className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Doctor</p>
                    <p>Dr. {doctorNames[selectedPatient.assignedDoctor] || 'Loading...'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaPhoneAlt className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p>{selectedPatient.patientPhone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaNotesMedical className="text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Notes</p>
                    <p>{selectedPatient.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatient
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Add Update Patient Modal */}
      <UpdatePatient
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        patient={selectedPatient}
      />
    </div>
  );
}

export default Patients;
