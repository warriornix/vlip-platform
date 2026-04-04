import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
    const navigate = useNavigate();

    const services = [
        { icon: '🎨', title: 'UI/UX Website Design', desc: 'Clean, user-focused layouts with clear structure, smooth navigation, and strong visual hierarchy.', features: ['Modern layouts', 'Responsive design'] },
        { icon: '💻', title: 'Frontend Development', desc: 'Responsive interfaces using React, TypeScript, and modern frameworks for consistent, reliable performance.', features: ['Clean code', 'Smooth interactions'] },
        { icon: '⚡', title: 'Performance & Responsiveness', desc: 'Fast, mobile-first websites optimized for speed, accessibility, and dependable performance.', features: ['Speed optimization', 'Asset efficiency'] },
        { icon: '🔧', title: 'VLIP Platform Integration', desc: 'Complete vehicle lifecycle management with blockchain certificates and predictive maintenance.', features: ['Fleet tracking', 'AI predictions'] }
    ];

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>VLIP Platform</h1>
                    <p style={styles.heroSubtitle}>Vehicle Lifecycle Integration Platform</p>
                    <p style={styles.heroText}>Blending thoughtful UI design with clean, responsive development to create fleet management solutions that look great and perform flawlessly.</p>
                    <div style={styles.heroButtons}>
                        <button onClick={() => navigate('/dashboard')} style={styles.primaryBtn}>Explore Platform →</button>
                        <button onClick={() => navigate('/about')} style={styles.secondaryBtn}>Learn More</button>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Services</h2>
                <p style={styles.sectionSubtitle}>Designing clean scalable responsive websites</p>
                <div style={styles.servicesGrid}>
                    {services.map((service, idx) => (
                        <div key={idx} style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>{service.icon}</div>
                            <h3 style={styles.serviceTitle}>{service.title}</h3>
                            <p style={styles.serviceDesc}>{service.desc}</p>
                            <ul style={styles.serviceList}>
                                {service.features.map((f, i) => (<li key={i}>{f}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Features Highlight */}
            <div style={styles.featuresSection}>
                <h2 style={styles.sectionTitleWhite}>Platform Features</h2>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard}>📊 Management Dashboard</div>
                    <div style={styles.featureCard}>⛽ Fuel Management Tools</div>
                    <div style={styles.featureCard}>🔧 Maintenance & Expense Tracking</div>
                    <div style={styles.featureCard}>📅 Preventive Maintenance Schedules</div>
                    <div style={styles.featureCard}>📚 Vehicle Information Repository</div>
                    <div style={styles.featureCard}>📈 Comprehensive Reporting Tools</div>
                </div>
            </div>

            {/* Stats Section */}
            <div style={styles.statsSection}>
                <div style={styles.statCard}><span style={styles.statNumber}>02+</span><span>Years of Experience</span></div>
                <div style={styles.statCard}><span style={styles.statNumber}>15+</span><span>Projects Completed</span></div>
                <div style={styles.statCard}><span style={styles.statNumber}>05+</span><span>Clients Served</span></div>
            </div>

            {/* Call to Action */}
            <div style={styles.cta}>
                <h2 style={styles.ctaTitle}>Ready to Transform Your Fleet Management?</h2>
                <button onClick={() => navigate('/register')} style={styles.ctaBtn}>Get Started →</button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' },
    hero: { backgroundColor: '#1976d2', padding: '100px 20px', textAlign: 'center', borderBottom: '1px solid #222' },
    heroContent: { maxWidth: '800px', margin: '0 auto' },
    heroTitle: { fontSize: '56px', color: 'white', marginBottom: '16px' },
    heroSubtitle: { fontSize: '24px', color: '#888', marginBottom: '16px' },
    heroText: { fontSize: '18px', color: '#aaa', lineHeight: '1.6', marginBottom: '32px' },
    heroButtons: { display: 'flex', gap: '20px', justifyContent: 'center' },
    primaryBtn: { padding: '12px 30px', backgroundColor: 'white', color: '#000', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
    secondaryBtn: { padding: '12px 30px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
    section: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' },
    sectionTitle: { fontSize: '36px', color: 'white', textAlign: 'center', marginBottom: '16px' },
    sectionTitleWhite: { fontSize: '36px', color: 'white', textAlign: 'center', marginBottom: '40px' },
    sectionSubtitle: { fontSize: '18px', color: '#888', textAlign: 'center', marginBottom: '48px' },
    servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' },
    serviceCard: { backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #222' },
    serviceIcon: { fontSize: '48px', marginBottom: '16px' },
    serviceTitle: { fontSize: '20px', color: 'white', marginBottom: '12px' },
    serviceDesc: { fontSize: '14px', color: '#aaa', lineHeight: '1.5', marginBottom: '16px' },
    serviceList: { listStyle: 'none', padding: 0, fontSize: '13px', color: '#888' },
    featuresSection: { backgroundColor: '#000', padding: '80px 20px' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
    featureCard: { backgroundColor: '#111', padding: '20px', borderRadius: '8px', textAlign: 'center', color: 'white', border: '1px solid #222' },
    statsSection: { display: 'flex', justifyContent: 'center', gap: '60px', padding: '60px 20px', flexWrap: 'wrap', borderBottom: '1px solid #222' },
    statCard: { textAlign: 'center' },
    statNumber: { display: 'block', fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' },
    cta: { backgroundColor: '#000', textAlign: 'center', padding: '80px 20px' },
    ctaTitle: { fontSize: '32px', color: 'white', marginBottom: '24px' },
    ctaBtn: { padding: '14px 40px', backgroundColor: 'white', color: '#000', border: 'none', borderRadius: '4px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Homepage;