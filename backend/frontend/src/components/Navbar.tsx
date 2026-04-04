import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/about', label: 'About', icon: '📖' },
        { path: '/products', label: 'Products', icon: '⭐' },
        { path: '/partners', label: 'Partners', icon: '🤝' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav style={styles.navbar}>
            <div style={styles.navContainer}>
                <div style={styles.logo} onClick={() => navigate('/')}>
                    🚗 VLIP Platform
                </div>
                <div style={styles.navLinks}>
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                ...styles.navLink,
                                ...(isActive(item.path) ? styles.activeNavLink : {})
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isActive(item.path) ? 'rgba(25, 118, 210, 0.1)' : 'transparent';
                            }}
                        >
                            <span style={styles.navIcon}>{item.icon}</span>
                            <span style={styles.navLabel}>{item.label}</span>
                        </button>
                    ))}
                </div>
                <div style={styles.userSection}>
                    <span style={styles.userName}>👤 {user?.name || 'User'} ({user?.role || 'USER'})</span>
                    <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: { backgroundColor: '#1976d2', color: 'white', padding: '0 20px', position: 'sticky' as const, top: 0, zIndex: 1000 },
    navContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', height: '60px' },
    logo: { fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' },
    navLinks: { display: 'flex', gap: '10px' },
    navLink: { background: 'none', border: 'none', color: 'white', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' },
    navIcon: { fontSize: '16px' },
    navLabel: { fontSize: '14px' },
    activeNavLink: { backgroundColor: 'rgba(255,255,255,0.2)' },
    userSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    userName: { fontSize: '14px' },
    logoutBtn: { padding: '6px 12px', backgroundColor: '#fff', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
};

export default Navbar;