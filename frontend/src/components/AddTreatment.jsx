import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaNotesMedical } from 'react-icons/fa';

function AddTreatment({ isOpen, onClose, onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    disease: '',
    medication: '',
    description: '',
    doctor: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/api/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDoctors(response.data.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.VITE_BACKEND_URL}/api/treatments`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onSuccess();
      onClose();
      setFormData({
        disease: '',
        medication: '',
        description: '',
        doctor: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding treatment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl my-8 relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex items-center mb-6">
          <FaNotesMedical className="text-blue-500 text-2xl mr-4" />
          <h2 className="text-2xl font-bold text-white">Add New Treatment</h2>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Disease</label>
            <input
              type="text"
              value={formData.disease}
              onChange={(e) => setFormData({...formData, disease: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Medication</label>
            <input
              type="text"
              value={formData.medication}
              onChange={(e) => setFormData({...formData, medication: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Doctor</label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Treatment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTreatment; 