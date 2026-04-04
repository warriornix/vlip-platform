import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    const memberships = [
        { name: 'SEMA', logo: '🏭', desc: 'Specialty Equipment Marketing Association' },
        { name: 'NAFA', logo: '🚚', desc: 'Fleet Management Association' },
        { name: 'SAE International', logo: '🔧', desc: 'Automotive Engineering Society' }
    ];

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Contact Section */}
                <div style={styles.column}>
                    <h3 style={styles.columnTitle}>Contact Us</h3>
                    <div style={styles.contactInfo}>
                        <p><strong>VLIP Technologies</strong></p>
                        <p>123 Innovation Drive<br />Suite 500<br />Silicon Valley, CA 94025</p>
                        <p>Phone: <a href="tel:+18885551234" style={styles.link}>1-888-555-1234</a></p>
                        <p>Email: <a href="mailto:sales@vlip.com" style={styles.link}>sales@vlip.com</a></p>
                        <p>Support: <a href="mailto:support@vlip.com" style={styles.link}>support@vlip.com</a></p>
                    </div>
                </div>

                {/* Services Section */}
                <div style={styles.column}>
                    <h3 style={styles.columnTitle}>Services</h3>
                    <ul style={styles.list}>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Commercial Fleets</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Government Fleets</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Consumers</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Limousine & Chartered Tour</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Landscaping & Turf Management</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Commercial Painters</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>HVAC Companies</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Churches & Houses of Worship</a></li>
                    </ul>
                </div>

                {/* Vehicle Resources Section */}
                <div style={styles.column}>
                    <h3 style={styles.columnTitle}>Vehicle Resources</h3>
                    <ul style={styles.list}>
                        <li><a onClick={() => navigate('/dashboard')} style={styles.link}>Fuel Management Tools</a></li>
                        <li><a onClick={() => navigate('/maintenance')} style={styles.link}>Maintenance & Expense Tracking</a></li>
                        <li><a onClick={() => navigate('/maintenance')} style={styles.link}>Preventive Maintenance Schedules</a></li>
                        <li><a onClick={() => navigate('/vehicles')} style={styles.link}>Vehicle Information Repository</a></li>
                        <li><a onClick={() => navigate('/analytics')} style={styles.link}>Comprehensive Reporting Tools</a></li>
                        <li><a onClick={() => navigate('/dashboard')} style={styles.link}>Search Recalls</a></li>
                        <li><a onClick={() => navigate('/products')} style={styles.link}>Car Care Articles</a></li>
                        <li><a onClick={() => navigate('/certificates')} style={styles.link}>Window Sticker Directory</a></li>
                    </ul>
                </div>

                {/* Memberships & Affiliations Section */}
                <div style={styles.column}>
                    <h3 style={styles.columnTitle}>Memberships & Affiliations</h3>
                    <div style={styles.membershipsGrid}>
                        {memberships.map((m, i) => (
                            <div key={i} style={styles.membershipBadge}>
                                <span style={styles.membershipLogo}>{m.logo}</span>
                                <div>
                                    <strong>{m.name}</strong>
                                    <p style={styles.membershipDesc}>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links Section */}
                <div style={styles.column}>
                    <h3 style={styles.columnTitle}>Quick Links</h3>
                    <ul style={styles.list}>
                        <li><a onClick={() => navigate('/about')} style={styles.link}>About Us</a></li>
                        <li><a href="#" style={styles.link}>Privacy Policy</a></li>
                        <li><a href="#" style={styles.link}>Terms of Service</a></li>
                        <li><a href="#" style={styles.link}>API Documentation</a></li>
                        <li><a href="#" style={styles.link}>Developer Portal</a></li>
                        <li><a href="#" style={styles.link}>Status Page</a></li>
                        <li><a href="#" style={styles.link}>Careers</a></li>
                        <li><a href="#" style={styles.link}>Press Kit</a></li>
                    </ul>
                </div>
            </div>

            {/* Trust Badges Section */}
            <div style={styles.trustSection}>
                <div style={styles.trustContainer}>
                    <div style={styles.trustBadge}>🔒 SSL Secure</div>
                    <div style={styles.trustBadge}>⭐ Trusted by 500+ Companies</div>
                    <div style={styles.trustBadge}>🚀 99.9% Uptime</div>
                    <div style={styles.trustBadge}>💳 PCI Compliant</div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={styles.bottomBar}>
                <div style={styles.bottomContainer}>
                    <p style={styles.copyright}>
                        &copy; {currentYear} VLIP Platform - Vehicle Lifecycle Integration Platform. All rights reserved.
                    </p>
                    <div style={styles.socialLinks}>
                        <a href="#" style={styles.socialLink}>📘 Facebook</a>
                        <a href="#" style={styles.socialLink}>🐦 Twitter</a>
                        <a href="#" style={styles.socialLink}>🔗 LinkedIn</a>
                        <a href="#" style={styles.socialLink}>📸 Instagram</a>
                        <a href="#" style={styles.socialLink}>💻 GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    footer: {
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        marginTop: '60px',
        fontFamily: 'sans-serif',
        borderTop: '1px solid #222'
    },
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 20px 40px',
        borderBottom: '1px solid #222'
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    columnTitle: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #333'
    },
    contactInfo: {
        lineHeight: '1.8',
        fontSize: '14px',
        color: '#aaa'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    link: {
        color: '#aaa',
        textDecoration: 'none',
        fontSize: '13px',
        lineHeight: '2.2',
        cursor: 'pointer',
        transition: 'color 0.2s'
    },
    membershipsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    membershipBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px',
        backgroundColor: '#111',
        borderRadius: '8px',
        border: '1px solid #222'
    },
    membershipLogo: {
        fontSize: '28px'
    },
    membershipDesc: {
        fontSize: '11px',
        color: '#666',
        margin: '4px 0 0'
    },
    trustSection: {
        backgroundColor: '#000',
        padding: '20px',
        borderBottom: '1px solid #222'
    },
    trustContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    trustBadge: {
        padding: '8px 16px',
        backgroundColor: '#111',
        borderRadius: '20px',
        fontSize: '12px',
        color: '#fff',
        border: '1px solid #333'
    },
    bottomBar: {
        backgroundColor: '#000',
        padding: '20px 0'
    },
    bottomContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
    },
    copyright: {
        fontSize: '12px',
        margin: 0,
        color: '#666'
    },
    socialLinks: {
        display: 'flex',
        gap: '20px'
    },
    socialLink: {
        color: '#666',
        textDecoration: 'none',
        fontSize: '12px',
        transition: 'color 0.2s'
    }
};

export default Footer;