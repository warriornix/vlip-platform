import React from 'react';

const Partners: React.FC = () => {
    const partners = [
        { name: 'AutoCare Plus', logo: '🔧', desc: 'Premium Maintenance Partner' },
        { name: 'BlockChain Secure', logo: '🔗', desc: 'Blockchain Security Provider' },
        { name: 'FleetMaster', logo: '🚛', desc: 'Fleet Management Solutions' },
        { name: 'GreenDrive EV', logo: '🔋', desc: 'Electric Vehicle Specialists' },
        { name: 'DataGuard', logo: '🛡️', desc: 'Data Security & Compliance' },
        { name: 'CloudFleet', logo: '☁️', desc: 'Cloud Infrastructure' }
    ];

    const memberships = [
        { name: 'SEMA', logo: '🏭', desc: 'Specialty Equipment Marketing Association' },
        { name: 'NAFA', logo: '🚚', desc: 'Fleet Management Association' },
        { name: 'SAE International', logo: '🔧', desc: 'Automotive Engineering Society' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <h1 style={styles.title}>Partners & Affiliations</h1>
                <p style={styles.subtitle}>Trusted by industry leaders worldwide</p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Our Partners</h2>
                <div style={styles.partnersGrid}>
                    {partners.map((p, i) => (
                        <div key={i} style={styles.partnerCard}>
                            <div style={styles.partnerLogo}>{p.logo}</div>
                            <h3 style={styles.partnerName}>{p.name}</h3>
                            <p style={styles.partnerDesc}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.sectionAlt}>
                <h2 style={styles.sectionTitleWhite}>Memberships & Affiliations</h2>
                <div style={styles.membershipsGrid}>
                    {memberships.map((m, i) => (
                        <div key={i} style={styles.membershipCard}>
                            <div style={styles.membershipLogo}>{m.logo}</div>
                            <h3 style={styles.membershipName}>{m.name}</h3>
                            <p style={styles.membershipDesc}>{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.cta}>
                <h2 style={styles.ctaTitle}>Become a Partner</h2>
                <p style={styles.ctaText}>Join our growing network of industry partners</p>
                <button style={styles.ctaBtn}>Contact Us →</button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' },
    hero: { backgroundColor: '#1976d2', padding: '80px 20px', textAlign: 'center' },
    title: { fontSize: '48px', color: 'white', marginBottom: '16px' },
    subtitle: { fontSize: '18px', color: 'rgba(255,255,255,0.9)' },
    section: { padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' },
    sectionAlt: { backgroundColor: '#111', padding: '60px 20px' },
    sectionTitle: { fontSize: '32px', color: 'white', textAlign: 'center', marginBottom: '40px' },
    sectionTitleWhite: { fontSize: '32px', color: 'white', textAlign: 'center', marginBottom: '40px' },
    partnersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' },
    partnerCard: { backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' },
    partnerLogo: { fontSize: '48px', marginBottom: '16px' },
    partnerName: { fontSize: '20px', color: '#1976d2', marginBottom: '12px' },
    partnerDesc: { fontSize: '14px', color: '#aaa', lineHeight: '1.5' },
    membershipsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' },
    membershipCard: { backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' },
    membershipLogo: { fontSize: '48px', marginBottom: '16px' },
    membershipName: { fontSize: '20px', color: '#1976d2', marginBottom: '12px' },
    membershipDesc: { fontSize: '14px', color: '#aaa', lineHeight: '1.5' },
    cta: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#0a0a0a', borderTop: '1px solid #222' },
    ctaTitle: { fontSize: '28px', color: 'white', marginBottom: '16px' },
    ctaText: { fontSize: '16px', color: '#aaa', marginBottom: '24px' },
    ctaBtn: { padding: '12px 30px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }
};

export default Partners;