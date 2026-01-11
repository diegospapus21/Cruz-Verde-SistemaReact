import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Admin/Dashboard';
import VolunteerManagement from './components/Admin/VolunteerManagement';
import Reports from './components/Admin/Reports';
import AttendanceControl from './components/Volunteer/AttendanceControl';
import Profile from './components/Volunteer/Profile';
import History from './components/Volunteer/History';
import Header from './components/Layout/Header';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/volunteer" />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {user && <Header />}
        
        <Routes>
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/volunteer'} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/volunteer" /> : <Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/volunteers" element={<PrivateRoute adminOnly><VolunteerManagement /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute adminOnly><Reports /></PrivateRoute>} />
          
          {/* Volunteer Routes */}
          <Route path="/volunteer" element={<PrivateRoute><AttendanceControl /></PrivateRoute>} />
          <Route path="/volunteer/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/volunteer/history" element={<PrivateRoute><History /></PrivateRoute>} />
          
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/volunteer') : '/login'} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;