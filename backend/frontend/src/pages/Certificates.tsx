import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Certificate {
    id: string;
    certificateId: string;
    vehicleId: string;
    blockchainHash: string;
    createdAt: string;
    status: string;
    vehicle?: {
        manufacturer: string;
        model: string;
        vin: string;
        year: number;
    };
}

const Certificates: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyId, setVerifyId] = useState('');
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicle) {
            fetchCertificates();
        }
    }, [selectedVehicle]);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/vehicles');
            setVehicles(response.data.vehicles || []);
            if (response.data.vehicles && response.data.vehicles.length > 0) {
                setSelectedVehicle(response.data.vehicles[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    const fetchCertificates = async () => {
        if (!selectedVehicle) return;
        setLoading(true);
        try {
            const response = await api.get(`/certificates/vehicle/${selectedVehicle}/certificates`);
            const certs = response.data.certificates || [];
            const vehicle = vehicles.find(v => v.id === selectedVehicle);
            const certsWithVehicle = certs.map((c: any) => ({ ...c, vehicle }));
            setCertificates(certsWithVehicle);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const issueCertificate = async () => {
        if (!selectedVehicle) return;
        try {
            await api.post(`/certificates/vehicle/${selectedVehicle}/issue`);
            fetchCertificates();
            alert('Certificate issued successfully! Blockchain hash generated.');
        } catch (error) {
            alert('Failed to issue certificate');
        }
    };

    const revokeCertificate = async (certificateId: string) => {
        if (window.confirm('Revoke this certificate? This action cannot be undone.')) {
            try {
                await api.post(`/certificates/revoke/${certificateId}`);
                fetchCertificates();
                alert('Certificate revoked successfully');
            } catch (error) {
                alert('Failed to revoke certificate');
            }
        }
    };

    const verifyCertificate = async () => {
        if (!verifyId) return;
        setVerifying(true);
        try {
            const response = await api.get(`/certificates/verify/${verifyId}`);
            setVerificationResult(response.data);
        } catch (error) {
            setVerificationResult({ isValid: false, message: 'Certificate not found or invalid' });
        } finally {
            setVerifying(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Hash copied to clipboard!');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📜 Digital Certificates</h1>
            <p style={styles.subtitle}>Blockchain-verified vehicle certificates with SHA-256 hashing</p>

            {/* Vehicle Selector */}
            <div style={styles.selectorContainer}>
                <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    style={styles.select}
                >
                    {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                            {v.manufacturer} {v.model} ({v.year}) - {v.vin}
                        </option>
                    ))}
                </select>
                <button onClick={issueCertificate} style={styles.issueBtn}>
                    + Issue New Certificate
                </button>
            </div>

            {/* Certificate Verification Section */}
            <div style={styles.verifySection}>
                <h3>🔍 Verify a Certificate</h3>
                <p style={styles.verifyDesc}>Enter a certificate ID to verify its authenticity on the blockchain</p>
                <div style={styles.verifyForm}>
                    <input
                        type="text"
                        placeholder="Enter Certificate ID (e.g., CERT-1234567890-1)"
                        value={verifyId}
                        onChange={(e) => setVerifyId(e.target.value)}
                        style={styles.verifyInput}
                    />
                    <button onClick={verifyCertificate} disabled={verifying} style={styles.verifyBtn}>
                        {verifying ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
                {verificationResult && (
                    <div style={{
                        ...styles.verificationResult,
                        backgroundColor: verificationResult.isValid ? '#e8f5e9' : '#ffebee',
                        borderLeftColor: verificationResult.isValid ? '#4caf50' : '#f44336'
                    }}>
                        <div style={styles.verificationIcon}>
                            {verificationResult.isValid ? '✅' : '❌'}
                        </div>
                        <div style={styles.verificationContent}>
                            <p style={styles.verificationStatus}>
                                {verificationResult.isValid ? 'Certificate is VALID' : 'Certificate is INVALID'}
                            </p>
                            {verificationResult.certificate && (
                                <div style={styles.verificationDetails}>
                                    <p><strong>Vehicle:</strong> {verificationResult.certificate.vehicleInfo?.manufacturer} {verificationResult.certificate.vehicleInfo?.model}</p>
                                    <p><strong>VIN:</strong> {verificationResult.certificate.vehicleInfo?.vin}</p>
                                    <p><strong>Issued:</strong> {new Date(verificationResult.certificate.issuedAt).toLocaleString()}</p>
                                    <p><strong>Blockchain Hash:</strong> 
                                        <code style={styles.hashCode}>{verificationResult.certificate.blockchainHash?.substring(0, 40)}...</code>
                                        <button onClick={() => copyToClipboard(verificationResult.certificate.blockchainHash)} style={styles.copyBtn}>Copy</button>
                                    </p>
                                    <p><strong>Verification Status:</strong> {verificationResult.verificationStatus}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Certificates List */}
            <h2 style={styles.sectionTitle}>Your Certificates</h2>
            {loading ? (
                <div style={styles.loader}>Loading certificates...</div>
            ) : certificates.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>No certificates issued yet.</p>
                    <p style={styles.emptyHint}>Click "Issue New Certificate" to create a blockchain-verified certificate for this vehicle.</p>
                </div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Certificate ID</th>
                                <th style={styles.th}>Issued Date</th>
                                <th style={styles.th}>Blockchain Hash</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.map((cert) => (
                                <tr key={cert.id}>
                                    <td style={styles.td}>
                                        <code>{cert.certificateId}</code>
                                    </td>
                                    <td style={styles.td}>{new Date(cert.createdAt).toLocaleString()}</td>
                                    <td style={styles.td}>
                                        <code style={styles.hashPreview}>{cert.blockchainHash?.substring(0, 30)}...</code>
                                        <button onClick={() => copyToClipboard(cert.blockchainHash)} style={styles.copySmallBtn}>Copy</button>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={cert.status === 'active' ? styles.activeBadge : styles.revokedBadge}>
                                            {cert.status || 'Active'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => revokeCertificate(cert.certificateId)} style={styles.revokeBtn}>
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Blockchain Info */}
            <div style={styles.infoSection}>
                <h3>🔗 About Blockchain Certificates</h3>
                <p>Each certificate is secured with SHA-256 blockchain hashing, providing:</p>
                <ul style={styles.infoList}>
                    <li>✅ Tamper-proof verification</li>
                    <li>✅ Immutable ownership records</li>
                    <li>✅ Public verifiability</li>
                    <li>✅ Decentralized trust</li>
                </ul>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'sans-serif'
    },
    title: {
        color: '#1976d2',
        marginBottom: '5px'
    },
    subtitle: {
        color: '#666',
        marginBottom: '20px'
    },
    selectorContainer: {
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    select: {
        flex: 1,
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    issueBtn: {
        padding: '12px 24px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    verifySection: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
    },
    verifyDesc: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '15px'
    },
    verifyForm: {
        display: 'flex',
        gap: '10px'
    },
    verifyInput: {
        flex: 1,
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px'
    },
    verifyBtn: {
        padding: '12px 24px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    verificationResult: {
        marginTop: '20px',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid',
        display: 'flex',
        gap: '15px'
    },
    verificationIcon: {
        fontSize: '32px'
    },
    verificationContent: {
        flex: 1
    },
    verificationStatus: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 'bold'
    },
    verificationDetails: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#666'
    },
    hashCode: {
        backgroundColor: '#f0f0f0',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px'
    },
    copyBtn: {
        marginLeft: '8px',
        padding: '2px 6px',
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '11px'
    },
    copySmallBtn: {
        marginLeft: '8px',
        padding: '2px 6px',
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '10px'
    },
    sectionTitle: {
        marginBottom: '15px'
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    tableHeader: {
        backgroundColor: '#f0f0f0'
    },
    th: {
        padding: '12px',
        border: '1px solid #ddd',
        textAlign: 'left'
    },
    td: {
        padding: '10px',
        border: '1px solid #ddd',
        verticalAlign: 'middle'
    },
    hashPreview: {
        backgroundColor: '#f5f5f5',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px'
    },
    activeBadge: {
        padding: '4px 8px',
        backgroundColor: '#4caf50',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px'
    },
    revokedBadge: {
        padding: '4px 8px',
        backgroundColor: '#f44336',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px'
    },
    revokeBtn: {
        padding: '5px 10px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    infoSection: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px'
    },
    infoList: {
        marginTop: '10px',
        paddingLeft: '20px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
    },
    emptyHint: {
        fontSize: '12px',
        marginTop: '10px',
        color: '#999'
    },
    loader: {
        textAlign: 'center',
        padding: '50px'
    }
};

export default Certificates;