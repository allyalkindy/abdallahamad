import React from 'react';
import { FaUserMd, FaHeart, FaBookMedical, FaPray, FaHandHoldingHeart } from 'react-icons/fa';
import { RiMentalHealthFill } from 'react-icons/ri';
import { GiHealing } from 'react-icons/gi';




function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900">
   
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <FaUserMd className="mx-auto h-20 w-20 text-blue-500 mb-6" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Spiritual Healing</span>
              <span className="block text-blue-500">For Mind, Body & Soul</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connect with experienced spiritual healers and begin your journey towards holistic wellness.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Join as Doctor
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose Our Platform
            </h2>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <FaPray className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-white text-center">Holistic Healing</h3>
                <p className="mt-2 text-gray-300 text-center">
                  Integrate spiritual and traditional healing methods for comprehensive patient care.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <RiMentalHealthFill className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-white text-center">Patient Management</h3>
                <p className="mt-2 text-gray-300 text-center">
                  Efficiently manage your patients and track their spiritual healing journey.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <GiHealing className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-white text-center">Treatment Plans</h3>
                <p className="mt-2 text-gray-300 text-center">
                  Create customized spiritual treatment plans for each patient's unique needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mx-auto">
                <FaUserMd className="h-8 w-8 text-white" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">500+</p>
              <p className="mt-1 text-gray-400">Spiritual Doctors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mx-auto">
                <FaHeart className="h-8 w-8 text-white" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">10k+</p>
              <p className="mt-1 text-gray-400">Patients Helped</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mx-auto">
                <FaPray className="h-8 w-8 text-white" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">1k+</p>
              <p className="mt-1 text-gray-400">Treatment Methods</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mx-auto">
                <FaBookMedical className="h-8 w-8 text-white" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">20k+</p>
              <p className="mt-1 text-gray-400">Consultations</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your journey?</span>
            <span className="block text-blue-200">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a href="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
