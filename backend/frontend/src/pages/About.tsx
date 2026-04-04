import React from 'react';

const About: React.FC = () => {
    const milestones = [
        { year: '2024', title: 'VLIP Platform Founded', desc: 'Started with a vision to revolutionize fleet management' },
        { year: '2025', title: 'Launch of Predictive Maintenance', desc: 'AI-powered vehicle health predictions' },
        { year: '2026', title: 'Blockchain Certificates', desc: 'SHA-256 secured digital certificates for vehicles' }
    ];

    const approach = [
        { step: '01', title: 'Understand users & goals', desc: 'Analyze fleet operator needs and pain points' },
        { step: '02', title: 'Create clean UI layouts', desc: 'Design intuitive interfaces for vehicle management' },
        { step: '03', title: 'Responsive experiences', desc: 'Ensure seamless access across all devices' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <h1 style={styles.title}>About VLIP Platform</h1>
                <p style={styles.subtitle}>Vehicle Lifecycle Integration Platform</p>
            </div>

            <div style={styles.content}>
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Our Story</h2>
                    <p style={styles.text}>VLIP Platform was founded with a mission to transform vehicle fleet management through innovative technology. We combine blockchain verification, AI-powered predictive maintenance, and intuitive design to help fleet operators maximize vehicle value and minimize downtime.</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Milestones</h2>
                    <div style={styles.timeline}>
                        {milestones.map((m, i) => (
                            <div key={i} style={styles.timelineItem}>
                                <div style={styles.timelineYear}>{m.year}</div>
                                <div style={styles.timelineContent}>
                                    <h3 style={styles.timelineTitle}>{m.title}</h3>
                                    <p style={styles.timelineDesc}>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>My Approach</h2>
                    <div style={styles.approachGrid}>
                        {approach.map((a, i) => (
                            <div key={i} style={styles.approachCard}>
                                <div style={styles.approachStep}>{a.step}</div>
                                <h3 style={styles.approachTitle}>{a.title}</h3>
                                <p style={styles.approachDesc}>{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Skills & Technologies</h2>
                    <div style={styles.skillsGrid}>
                        <div style={styles.skillGroup}>
                            <h3 style={styles.skillGroupTitle}>Core Skills</h3>
                            <ul style={styles.skillList}>
                                <li>UI/UX layout</li>
                                <li>Responsive Web Design</li>
                                <li>Component-Based Design</li>
                            </ul>
                        </div>
                        <div style={styles.skillGroup}>
                            <h3 style={styles.skillGroupTitle}>Frontend Tech</h3>
                            <ul style={styles.skillList}>
                                <li>React</li>
                                <li>TypeScript</li>
                                <li>Node.js</li>
                            </ul>
                        </div>
                        <div style={styles.skillGroup}>
                            <h3 style={styles.skillGroupTitle}>Blockchain</h3>
                            <ul style={styles.skillList}>
                                <li>SHA-256</li>
                                <li>Smart Contracts</li>
                                <li>Certificate Verification</li>
                            </ul>
                        </div>
                        <div style={styles.skillGroup}>
                            <h3 style={styles.skillGroupTitle}>Tools</h3>
                            <ul style={styles.skillList}>
                                <li>GitHub</li>
                                <li>Docker</li>
                                <li>Prisma</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' },
    hero: { backgroundColor: '#000', padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid #222' },
    title: { fontSize: '48px', color: 'white', marginBottom: '16px' },
    subtitle: { fontSize: '20px', color: '#888' },
    content: { maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' },
    section: { marginBottom: '60px' },
    sectionTitle: { fontSize: '28px', color: 'white', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px' },
    text: { fontSize: '16px', color: '#aaa', lineHeight: '1.6' },
    timeline: { display: 'flex', flexDirection: 'column', gap: '20px' },
    timelineItem: { display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#111', borderRadius: '8px' },
    timelineYear: { fontSize: '20px', fontWeight: 'bold', color: '#fff', minWidth: '80px' },
    timelineContent: { flex: 1 },
    timelineTitle: { color: 'white', marginBottom: '8px', fontSize: '18px' },
    timelineDesc: { color: '#888', fontSize: '14px' },
    approachGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    approachCard: { backgroundColor: '#111', padding: '25px', borderRadius: '8px', textAlign: 'center' },
    approachStep: { fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' },
    approachTitle: { color: 'white', marginBottom: '12px', fontSize: '18px' },
    approachDesc: { color: '#aaa', fontSize: '14px', lineHeight: '1.5' },
    skillsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
    skillGroup: { backgroundColor: '#111', padding: '20px', borderRadius: '8px' },
    skillGroupTitle: { color: 'white', marginBottom: '12px', fontSize: '18px' },
    skillList: { listStyle: 'none', padding: 0, margin: 0, color: '#aaa', lineHeight: '1.8' }
};

export default About;