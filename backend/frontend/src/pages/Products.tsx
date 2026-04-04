import React from 'react';
import { useNavigate } from 'react-router-dom';

const Products: React.FC = () => {
    const navigate = useNavigate();

    const productCategories = [
        { title: 'Management Dashboard', icon: '📊', items: ['Real-time fleet analytics', 'Vehicle health monitoring', 'Customizable reports', 'KPI tracking'] },
        { title: 'Fuel Management Tools', icon: '⛽', items: ['Fuel consumption tracking', 'MPG monitoring', 'Cost analysis', 'Efficiency reports'] },
        { title: 'Maintenance & Expense Tracking', icon: '🔧', items: ['Service history', 'Cost tracking', 'Vendor management', 'Part inventory'] },
        { title: 'Preventive Maintenance Schedules', icon: '📅', items: ['Automated reminders', 'Mileage-based alerts', 'Service intervals', 'Fleet-wide scheduling'] },
        { title: 'Vehicle Information Repository', icon: '📚', items: ['VIN database', 'Document storage', 'Service records', 'Ownership history'] },
        { title: 'Comprehensive Reporting Tools', icon: '📈', items: ['Custom reports', 'Export to CSV/PDF', 'Analytics dashboard', 'Trend analysis'] },
        { title: 'Unlimited Users', icon: '👥', items: ['Role-based access', 'Team collaboration', 'Permission controls', 'Audit logs'] },
        { title: 'Multiple Security Levels', icon: '🔒', items: ['Encrypted data', '2FA support', 'SSO integration', 'Compliance ready'] },
        { title: 'Data Import & Export Tools', icon: '🔄', items: ['CSV/Excel import', 'API access', 'Bulk operations', 'Data migration'] }
    ];

    const industries = {
        publicTransport: [
            { name: 'Kenya Bus Service (KBS)', icon: '🚍', desc: 'Large passenger fleets with high maintenance needs' },
            { name: 'Modern Coast Express', icon: '🚌', desc: 'Inter-city transport requiring lifecycle integration' }
        ],
        logistics: [
            { name: 'Sendy Logistics', icon: '📦', desc: 'Last-mile delivery optimization' },
            { name: 'Glovo Kenya', icon: '🛵', desc: 'On-demand delivery fleet management' },
            { name: 'DHL Kenya', icon: '✈️', desc: 'International logistics and freight' }
        ],
        rideHailing: [
            { name: 'Bolt Kenya', icon: '🚗', desc: 'Distributed driver fleet management' },
            { name: 'Uber Kenya', icon: '🚘', desc: 'Compliance and maintenance tracking' }
        ],
        automotiveDealers: [
            { name: 'CFAO Mobility Kenya Ltd', icon: '🏢', desc: 'Vehicle sales and leasing' },
            { name: 'Fleet (Kenya)', icon: '🚙', desc: 'Corporate fleet management' },
            { name: 'Isuzu East Africa', icon: '🚛', desc: 'Commercial vehicle manufacturer' },
            { name: 'DT Dobie Kenya', icon: '🚘', desc: 'Premium vehicle dealership' }
        ],
        securityUtility: [
            { name: 'G4S Kenya', icon: '🛡️', desc: 'Security patrol fleets' },
            { name: 'Kenya Power & Lighting Company (KPLC)', icon: '⚡', desc: 'Utility service vehicles' }
        ],
        government: [
            { name: 'National Police Service (Kenya)', icon: '👮', desc: 'Law enforcement fleet management' },
            { name: 'Kenya Red Cross Society', icon: '⛑️', desc: 'Emergency response vehicles' }
        ]
    };

    const industryCategories = [
        { title: 'Public Transport Operators', icon: '🚍', companies: industries.publicTransport },
        { title: 'Logistics & Delivery Companies', icon: '📦', companies: industries.logistics },
        { title: 'Ride-Hailing & Mobility Platforms', icon: '🚗', companies: industries.rideHailing },
        { title: 'Automotive Dealers & Manufacturers', icon: '🏭', companies: industries.automotiveDealers },
        { title: 'Security & Utility Fleets', icon: '⚡', companies: industries.securityUtility },
        { title: 'Government & Humanitarian Organizations', icon: '🏛️', companies: industries.government }
    ];

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>VLIP Platform</h1>
                <p style={styles.heroSubtitle}>Vehicle Lifecycle Integration Platform</p>
                <p style={styles.heroText}>Comprehensive vehicle lifecycle management solutions for fleets of all sizes</p>
                <div style={styles.heroButtons}>
                    <button onClick={() => navigate('/dashboard')} style={styles.primaryBtn}>Explore Dashboard →</button>
                    <button onClick={() => navigate('/contact')} style={styles.secondaryBtn}>Contact Sales</button>
                </div>
            </div>

            {/* Product Features Grid */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Product Features</h2>
                <div style={styles.productsGrid}>
                    {productCategories.map((product, index) => (
                        <div key={index} style={styles.productCard}>
                            <div style={styles.productIcon}>{product.icon}</div>
                            <h3 style={styles.productTitle}>{product.title}</h3>
                            <ul style={styles.productList}>
                                {product.items.map((item, i) => (<li key={i}>{item}</li>))}
                            </ul>
                            <button style={styles.learnMoreBtn}>Learn More →</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Industries We Serve Section */}
            <div style={styles.industriesSection}>
                <h2 style={styles.industriesTitle}>Industries We Serve</h2>
                <p style={styles.industriesSubtitle}>Trusted by industry leaders across Kenya and East Africa</p>
                
                {industryCategories.map((category, idx) => (
                    <div key={idx} style={styles.categoryContainer}>
                        <h3 style={styles.categoryTitle}>
                            <span style={styles.categoryIcon}>{category.icon}</span>
                            {category.title}
                        </h3>
                        <div style={styles.industryGrid}>
                            {category.companies.map((company, i) => (
                                <div key={i} style={styles.industryCard}>
                                    <div style={styles.industryIcon}>{company.icon}</div>
                                    <h4 style={styles.industryName}>{company.name}</h4>
                                    <p style={styles.industryDesc}>{company.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Strategic Takeaway Box */}
                <div style={styles.strategyBox}>
                    <h3 style={styles.strategyTitle}>✅ Strategic Takeaway</h3>
                    <div style={styles.strategyGrid}>
                        <div style={styles.strategyItem}>
                            <strong>Quick Wins:</strong> Automotive dealers & fleet managers (CFAO, Isuzu, DT Dobie) — they already manage lifecycle services.
                        </div>
                        <div style={styles.strategyItem}>
                            <strong>High Visibility:</strong> Public transport and ride-hailing (KBS, Bolt, Uber) — strong impact on everyday users.
                        </div>
                        <div style={styles.strategyItem}>
                            <strong>Long-Term Growth:</strong> Government and humanitarian fleets — slower adoption but high-volume contracts.
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div style={styles.ctaSection}>
                <h2 style={styles.ctaTitle}>Ready to Transform Your Fleet Management?</h2>
                <p style={styles.ctaText}>Join hundreds of satisfied fleet operators using VLIP Platform</p>
                <div style={styles.ctaButtons}>
                    <button onClick={() => navigate('/register')} style={styles.ctaBtn}>Start Free Trial</button>
                    <button onClick={() => navigate('/contact')} style={styles.ctaBtnSecondary}>Contact Sales</button>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: "'Inter', 'Poppins', sans-serif" },
    hero: { background: 'linear-gradient(135deg, #1976d2, #0d47a1)', padding: '100px 20px', textAlign: 'center' },
    heroTitle: { fontSize: '56px', fontWeight: 'bold', marginBottom: '16px', color: 'white' },
    heroSubtitle: { fontSize: '24px', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' },
    heroText: { fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px', color: 'rgba(255,255,255,0.8)' },
    heroButtons: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' },
    primaryBtn: { background: 'white', color: '#1976d2', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' },
    secondaryBtn: { background: 'transparent', color: 'white', border: '2px solid white', padding: '12px 32px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s ease' },
    section: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' },
    sectionTitle: { fontSize: '36px', textAlign: 'center', marginBottom: '48px', color: 'white' },
    productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' },
    productCard: { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', transition: 'all 0.3s ease' },
    productIcon: { fontSize: '48px', marginBottom: '16px' },
    productTitle: { fontSize: '20px', marginBottom: '16px', color: '#1976d2' },
    productList: { listStyle: 'none', padding: 0, margin: '16px 0', fontSize: '14px', color: '#ccc', lineHeight: '1.8' },
    learnMoreBtn: { background: '#1976d2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.3s ease' },
    industriesSection: { background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)', padding: '80px 20px' },
    industriesTitle: { fontSize: '2.5rem', color: '#ffffff', textAlign: 'center', marginBottom: '16px' },
    industriesSubtitle: { fontSize: '1rem', color: '#aaa', textAlign: 'center', marginBottom: '48px' },
    categoryContainer: { marginBottom: '48px', maxWidth: '1200px', margin: '0 auto 48px' },
    categoryTitle: { fontSize: '1.5rem', color: '#1976d2', marginBottom: '24px', borderLeft: '4px solid #1976d2', paddingLeft: '16px' },
    categoryIcon: { marginRight: '12px' },
    industryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    industryCard: { background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'all 0.3s ease' },
    industryIcon: { fontSize: '40px', marginBottom: '12px' },
    industryName: { fontSize: '16px', color: 'white', marginBottom: '8px', fontWeight: 'bold' },
    industryDesc: { fontSize: '12px', color: '#aaa', lineHeight: '1.4' },
    strategyBox: { background: 'rgba(25, 118, 210, 0.1)', border: '1px solid #1976d2', borderRadius: '16px', padding: '30px', maxWidth: '1200px', margin: '40px auto 0' },
    strategyTitle: { fontSize: '1.3rem', color: '#1976d2', marginBottom: '20px' },
    strategyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
    strategyItem: { background: '#111', padding: '16px', borderRadius: '8px', color: '#ddd', fontSize: '13px', lineHeight: '1.5' },
    ctaSection: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#111', borderTop: '1px solid #222' },
    ctaTitle: { fontSize: '32px', color: 'white', marginBottom: '16px' },
    ctaText: { fontSize: '16px', color: '#aaa', marginBottom: '32px' },
    ctaButtons: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaBtn: { background: '#1976d2', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' },
    ctaBtnSecondary: { background: 'transparent', color: '#1976d2', border: '2px solid #1976d2', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }
};

export default Products;