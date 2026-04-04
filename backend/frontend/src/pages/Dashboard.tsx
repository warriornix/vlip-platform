import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalMaintenanceCost: 0,
        averageHealthScore: 0,
        pendingMaintenance: 0,
        activeCertificates: 0
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const vehiclesRes = await api.get('/vehicles');
            const vehiclesData = vehiclesRes.data.vehicles || [];
            setVehicles(vehiclesData);
            setStats(prev => ({ ...prev, totalVehicles: vehiclesData.length }));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const vehicleCategories = [
        { name: 'Cars & Minivan', count: vehicles.filter(v => ['Honda', 'Toyota', 'Ford'].includes(v.manufacturer)).length, icon: '🚗', color: '#1976d2' },
        { name: 'Trucks', count: vehicles.filter(v => v.manufacturer === 'Ford' && v.model?.includes('F-150')).length, icon: '🛻', color: '#1976d2' },
        { name: 'Crossovers & SUVs', count: vehicles.filter(v => ['RAV4', 'CR-V', 'Explorer'].includes(v.model)).length, icon: '🚙', color: '#1976d2' },
        { name: 'Electrified', count: vehicles.filter(v => v.year >= 2023).length, icon: '🔋', color: '#1976d2' },
    ];

    const healthData = {
        labels: ['Excellent', 'Good', 'Fair', 'Critical'],
        datasets: [{ data: [60, 25, 10, 5], backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#9e9e9e'], borderWidth: 0 }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom' as const } }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;

    return (
        <div style={styles.container}>
            {/* Hero Banner */}
            <div style={styles.heroBanner}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>VLIP Platform</h1>
                    <p style={styles.heroSubtitle}>Vehicle Lifecycle Integration Platform</p>
                    <div style={styles.heroStats}>
                        <div style={styles.heroStat}><span style={styles.heroStatNumber}>{stats.totalVehicles}</span><span>Total Vehicles</span></div>
                        <div style={styles.heroStat}><span style={styles.heroStatNumber}>${stats.totalMaintenanceCost}</span><span>Maintenance Cost</span></div>
                        <div style={styles.heroStat}><span style={styles.heroStatNumber}>{stats.averageHealthScore}%</span><span>Avg Health</span></div>
                    </div>
                    <button style={styles.exploreBtn}>Explore Vehicles →</button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabNav}>
                {['overview', 'vehicles', 'maintenance', 'analytics'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div style={styles.tabContent}>
                    <div style={styles.categoriesGrid}>
                        {vehicleCategories.map(cat => (
                            <div key={cat.name} style={styles.categoryCard}>
                                <div style={styles.categoryIcon}>{cat.icon}</div>
                                <div style={styles.categoryInfo}>
                                    <h3 style={{ margin: 0 }}>{cat.name}</h3>
                                    <p style={styles.categoryCount}>{cat.count} vehicles</p>
                                </div>
                                <button style={styles.buildBtn}>Build &gt;</button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.chartSection}>
                        <h2 style={styles.sectionTitle}>Fleet Health Distribution</h2>
                        <div style={styles.chartContainer}>
                            <Pie data={healthData} options={chartOptions} />
                        </div>
                    </div>

                    <div style={styles.toolsSection}>
                        <h2 style={styles.sectionTitle}>Shopping Tools</h2>
                        <div style={styles.toolsGrid}>
                            <div style={styles.toolCard}>🔍 Search Inventory</div>
                            <div style={styles.toolCard}>💰 Payment Estimator</div>
                            <div style={styles.toolCard}>📊 Build & Price</div>
                            <div style={styles.toolCard}>📍 Find a Dealer</div>
                            <div style={styles.toolCard}>🏷️ Special Offers</div>
                            <div style={styles.toolCard}>📋 Request a Quote</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.footerTop}>
                    <div style={styles.footerColumn}>
                        <h4 style={styles.footerHeading}>Shopping Tools</h4>
                        <ul style={styles.footerList}>
                            <li>Build Your Vehicle</li><li>Search Inventory</li><li>Find a Dealer</li><li>Special Offers</li>
                        </ul>
                    </div>
                    <div style={styles.footerColumn}>
                        <h4 style={styles.footerHeading}>Vehicles</h4>
                        <ul style={styles.footerList}>
                            <li>SUVs</li><li>Trucks</li><li>Cars</li><li>Electrified Vehicles</li>
                        </ul>
                    </div>
                    <div style={styles.footerColumn}>
                        <h4 style={styles.footerHeading}>Owners</h4>
                        <ul style={styles.footerList}>
                            <li>Schedule Service</li><li>Safety Recalls</li><li>Manuals & Warranties</li><li>Manage Payments</li>
                        </ul>
                    </div>
                    <div style={styles.footerColumn}>
                        <h4 style={styles.footerHeading}>About</h4>
                        <ul style={styles.footerList}>
                            <li>Careers</li><li>About Us</li><li>Newsroom</li><li>Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p>© 2026 VLIP Platform - Vehicle Lifecycle Integration Platform. All rights reserved.</p>
                    <div style={styles.footerLinks}>
                        <a href="#" style={styles.footerLink}>Privacy Notice</a> | <a href="#" style={styles.footerLink}>Legal Terms</a> | <a href="#" style={styles.footerLink}>Site Map</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
    heroBanner: { backgroundColor: '#1976d2', color: 'white', padding: '60px 40px', textAlign: 'center' },
    heroContent: { maxWidth: '1200px', margin: '0 auto' },
    heroTitle: { fontSize: '48px', marginBottom: '10px' },
    heroSubtitle: { fontSize: '18px', marginBottom: '30px', opacity: 0.9 },
    heroStats: { display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '30px', flexWrap: 'wrap' },
    heroStat: { textAlign: 'center' },
    heroStatNumber: { display: 'block', fontSize: '32px', fontWeight: 'bold' },
    exploreBtn: { padding: '12px 30px', backgroundColor: 'white', color: '#1976d2', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    tabNav: { display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' },
    tabBtn: { padding: '10px 25px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#666' },
    tabActive: { borderBottom: '3px solid #1976d2', color: '#1976d2', fontWeight: 'bold' },
    tabContent: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    categoriesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' },
    categoryCard: { display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px', cursor: 'pointer' },
    categoryIcon: { fontSize: '48px' },
    categoryInfo: { flex: 1 },
    categoryCount: { color: '#666', fontSize: '14px', margin: '5px 0 0' },
    buildBtn: { padding: '8px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    chartSection: { backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '12px', marginBottom: '50px', textAlign: 'center' },
    sectionTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
    chartContainer: { maxWidth: '400px', margin: '0 auto' },
    toolsSection: { marginBottom: '50px' },
    toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
    toolCard: { padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' },
    footer: { backgroundColor: '#1a1a2e', color: '#e0e0e0', marginTop: '40px' },
    footerTop: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' },
    footerColumn: { display: 'flex', flexDirection: 'column', gap: '15px' },
    footerHeading: { color: '#1976d2', margin: 0, fontSize: '18px' },
    footerList: { listStyle: 'none', padding: 0, margin: 0 },
    footerBottom: { textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' },
    footerLinks: { marginTop: '10px' },
    footerLink: { color: '#e0e0e0', textDecoration: 'none', margin: '0 10px' }
};

export default Dashboard;

/* Modern CSS Reset & Base Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0a0a0a 0%, #0d1117 100%);
    color: #ffffff;
    line-height: 1.6;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #1976d2, #00bcd4); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #0d47a1; }

/* Glassmorphism Base */
.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 188, 212, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Gradient Buttons */
.btn-primary {
    background: linear-gradient(135deg, #1976d2, #00bcd4);
    border: none;
    border-radius: 12px;
    padding: 12px 28px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 188, 212, 0.4);
}

.btn-primary::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::before {
    width: 300px;
    height: 300px;
}

.btn-secondary {
    background: transparent;
    border: 2px solid #00bcd4;
    border-radius: 12px;
    padding: 10px 26px;
    color: #00bcd4;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(0, 188, 212, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
}

/* Number Counter Animation */
@keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.count-up {
    animation: countUp 0.6s ease-out;
}

/* Card Hover Effects */
.card-hover {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: #00bcd4;
    box-shadow: 0 20px 40px rgba(0, 188, 212, 0.2);
}

/* Neon Glow Effects */
.neon-text {
    text-shadow: 0 0 10px rgba(0, 188, 212, 0.5);
}

.neon-border {
    border: 1px solid #00bcd4;
    box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
}

/* Gradient Backgrounds */
.gradient-bg {
    background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
}

.gradient-hero {
    background: linear-gradient(135deg, #0d47a1, #1976d2, #00bcd4);
    background-size: 200% 200%;
    animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Fade In Animations */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
}

.fade-in-left {
    animation: fadeInLeft 0.6s ease-out forwards;
}

@keyframes fadeInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
}

.fade-in-right {
    animation: fadeInRight 0.6s ease-out forwards;
}

/* Stagger Children Animations */
.stagger-children > * {
    opacity: 0;
    animation: fadeInUp 0.5s ease-out forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
.stagger-children > *:nth-child(6) { animation-delay: 0.6s; }

/* Modern Card Grid */
.grid-modern {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

/* Stat Card Specific */
.stat-card {
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(0, 188, 212, 0.05));
    border: 1px solid rgba(0, 188, 212, 0.2);
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    border-color: #00bcd4;
    box-shadow: 0 10px 30px rgba(0, 188, 212, 0.15);
}

.stat-number {
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, #00bcd4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* Category Card */
.category-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-card:hover {
    transform: translateY(-5px);
    border-color: #00bcd4;
    background: rgba(0, 188, 212, 0.1);
}

/* Modern Table */
.table-modern {
    width: 100%;
    border-collapse: collapse;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    overflow: hidden;
}

.table-modern th {
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(0, 188, 212, 0.1));
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #00bcd4;
}

.table-modern td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.table-modern tr:hover {
    background: rgba(0, 188, 212, 0.05);
}

/* Responsive Design */
@media (max-width: 768px) {
    .grid-modern {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .stat-number {
        font-size: 28px;
    }
    
    .btn-primary, .btn-secondary {
        padding: 10px 20px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .stat-card {
        padding: 16px;
    }
    
    .stat-number {
        font-size: 24px;
    }
}

/* Loading Skeleton */
.skeleton {
    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Tooltip Styles */
.tooltip {
    position: relative;
    cursor: pointer;
}

.tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: #1976d2;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.tooltip:hover::after {
    opacity: 1;
    visibility: visible;
}

/* Chart Container */
.chart-container {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}