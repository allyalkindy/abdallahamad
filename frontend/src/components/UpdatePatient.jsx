import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaUserEdit } from 'react-icons/fa';

function UpdatePatient({ isOpen, onClose, onSuccess, patient }) {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    disease: '',
    treatments: '',
    assignedDoctor: '',
    patientPhone: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (patient) {
      setFormData({
        fullName: patient.fullName,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth.split('T')[0], // Format date for input
        disease: patient.disease,
        treatments: patient.treatments,
        assignedDoctor: patient.assignedDoctor,
        patientPhone: patient.patientPhone,
        notes: patient.notes
      });
    }
    fetchDoctors();
  }, [patient]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors', {
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
      await axios.put(`http://localhost:5000/api/patient/${patient._id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating patient');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl my-8 relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex items-center mb-6">
          <FaUserEdit className="text-blue-500 text-2xl mr-4" />
          <h2 className="text-2xl font-bold text-white">Update Patient</h2>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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
              <label className="block text-gray-300 mb-2 text-sm">Treatments</label>
              <input
                type="text"
                value={formData.treatments}
                onChange={(e) => setFormData({...formData, treatments: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Assigned Doctor</label>
              <select
                value={formData.assignedDoctor}
                onChange={(e) => setFormData({...formData, assignedDoctor: e.target.value})}
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
              <label className="block text-gray-300 mb-2 text-sm">Phone Number</label>
              <input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              required
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
              Update Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePatient; 