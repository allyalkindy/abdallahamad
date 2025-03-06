import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserMd, FaHome, FaSignInAlt, FaUserPlus, FaHospital, FaNotesMedical } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/patient-records', name: 'Patients', icon: <FaHospital /> },
    { path: '/treatments', name: 'Treatments', icon: <FaNotesMedical /> },
    { path: '/doctors', name: 'Doctors', icon: <FaUserMd /> },
  ];

  const authLinks = isLoggedIn 
    ? [{ name: 'Logout', onClick: handleLogout, icon: <FaSignInAlt /> }]
    : [
        { path: '/login', name: 'Login', icon: <FaSignInAlt /> },
        { path: '/signup', name: 'Sign Up', icon: <FaUserPlus /> },
      ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-gray-900/95'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaUserMd className="h-8 w-8 text-blue-500" />
            <span className="text-white font-bold text-xl">SpiritualCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-500 bg-gray-800'
                    : 'text-gray-300 hover:text-blue-500 hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
            {authLinks.map((link) => (
              <div
                key={link.name}
                onClick={link.onClick}
                className="cursor-pointer"
              >
                {link.path ? (
                  <Link
                    to={link.path}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-500 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ) : (
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-500 hover:bg-gray-800 transition-colors duration-200">
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'text-blue-500 bg-gray-800'
                  : 'text-gray-300 hover:text-blue-500 hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          {authLinks.map((link) => (
            <div
              key={link.name}
              onClick={() => {
                setIsOpen(false);
                link.onClick?.();
              }}
              className="cursor-pointer"
            >
              {link.path ? (
                <Link
                  to={link.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hover:bg-gray-800"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ) : (
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hover:bg-gray-800 w-full text-left">
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 