import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Partners from './pages/Partners';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Maintenance from './pages/Maintenance';
import Certificates from './pages/Certificates';
import Analytics from './pages/Analytics';
import Products from './pages/Products';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white', backgroundColor: '#0a0a0a' }}>Loading...</div>;
    return token ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
    const { token } = useAuth();
    
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
                <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
                <Route path="/certificates" element={<PrivateRoute><Certificates /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            </Routes>
            <Footer />
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;