   // frontend/src/App.jsx
   import React from 'react';
   import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
   import Login from './pages/Login';
   import Signup from './pages/Signup';
   import Homepage from './pages/Homepage';
   import Patients from './pages/Patients';
   import Treatments from './pages/Treatments';
   import Navbar from './components/Navbar';
   import Doctors from './pages/Doctors';
   import Welcome from './pages/Welcome';
  
   const PrivateRoute = ({ children }) => {
     const token = localStorage.getItem('token');
     const location = useLocation();
     
     if (!token) {
       // Redirect to login while saving the attempted location
       return <Navigate to="/login" state={{ from: location }} />;
     }

     // For welcome page, check if we're coming from login
    

     return children;
   };

   // Add AuthRoute to handle public routes when logged in
   const AuthRoute = ({ children }) => {
     const token = localStorage.getItem('token');
     
     if (token) {
       // If user is logged in, redirect to welcome page
       return <Navigate to="/welcome" state={{ fromLogin: true }} />;
     }

     return children;
   };

   function App() {
     return (
       <Router>
         <div>
           <Navbar />
           <div className="pt-16">
             <Routes>
               <Route 
                 path="/login" 
                 element={
                   <AuthRoute>
                     <Login />
                   </AuthRoute>
                 } 
               />
               <Route 
                 path="/signup" 
                 element={
                   <AuthRoute>
                     <Signup />
                   </AuthRoute>
                 } 
               />
               <Route path="/" element={<Homepage />} />
               <Route 
                 path="/welcome" 
                 element={
                   <PrivateRoute>
                     <Welcome />
                   </PrivateRoute>
                 } 
               />
               <Route 
                 path="/patient-records" 
                 element={
                   <PrivateRoute>
                     <Patients />
                   </PrivateRoute>
                 } 
               />
               <Route
                 path="/treatments"
                 element={
                   <PrivateRoute>
                     <Treatments />
                   </PrivateRoute>
                 }
               />
               <Route
                 path="/doctors"
                 element={
                   <PrivateRoute>
                     <Doctors />
                   </PrivateRoute>
                 }
               />
             </Routes>
           </div>
         </div>
       </Router>
     );
   }

   export default App;