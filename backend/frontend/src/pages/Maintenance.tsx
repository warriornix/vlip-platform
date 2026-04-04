import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Vehicle {
    id: string;
    vin: string;
    manufacturer: string;
    model: string;
    year: number;
}

interface MaintenanceRecord {
    id: number;
    component: string;
    serviceType: string;
    mileage: number;
    cost: number;
    description: string;
    severity: string;
    performedAt: string;
}

interface PredictiveAnalysis {
    healthScore: number;
    healthStatus: string;
    predictions: {
        engine: number;
        transmission: number;
        brakes: number;
        tires: number;
        battery: number;
    };
    recommendations: string[];
    maintenanceSchedule: {
        service: string;
        dueMiles: number;
        estimatedCost: number;
        priority: string;
    }[];
}

const Maintenance: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [analysis, setAnalysis] = useState<PredictiveAnalysis | null>(null);
    const [records, setRecords] = useState<MaintenanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [newRecord, setNewRecord] = useState({
        component: 'engine',
        serviceType: '',
        mileage: '',
        cost: '',
        description: '',
        severity: 'medium'
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicle) {
            fetchAnalysis();
            fetchHistory();
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

    const fetchAnalysis = async () => {
        if (!selectedVehicle) return;
        setLoading(true);
        try {
            const response = await api.get(`/maintenance/predictive/${selectedVehicle}`);
            setAnalysis(response.data.analysis);
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        if (!selectedVehicle) return;
        try {
            const response = await api.get(`/maintenance/history/${selectedVehicle}`);
            const recordsData = response.data.records || [];
            setRecords(recordsData);
            const total = recordsData.reduce((sum: number, r: any) => sum + (r.cost || 0), 0);
            setTotalCost(total);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const addMaintenanceRecord = async () => {
        if (!newRecord.serviceType || !newRecord.mileage || !newRecord.cost) {
            alert('Please fill in service type, mileage, and cost');
            return;
        }

        try {
            await api.post('/maintenance/records', {
                vehicleId: selectedVehicle,
                component: newRecord.component,
                serviceType: newRecord.serviceType,
                mileage: parseInt(newRecord.mileage),
                cost: parseFloat(newRecord.cost),
                description: newRecord.description,
                severity: newRecord.severity
            });
            setShowAddForm(false);
            setNewRecord({
                component: 'engine',
                serviceType: '',
                mileage: '',
                cost: '',
                description: '',
                severity: 'medium'
            });
            fetchAnalysis();
            fetchHistory();
            alert('Maintenance record added successfully!');
        } catch (error) {
            alert('Failed to add maintenance record');
        }
    };

    const deleteRecord = async (id: number) => {
        if (window.confirm('Delete this maintenance record?')) {
            try {
                await api.delete(`/maintenance/records/${id}`);
                fetchHistory();
                fetchAnalysis();
                alert('Record deleted');
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    const getHealthColor = (score: number): string => {
        if (score >= 80) return '#4caf50';
        if (score >= 60) return '#ff9800';
        return '#f44336';
    };

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'High': return '#f44336';
            case 'Medium': return '#ff9800';
            default: return '#4caf50';
        }
    };

    const getSeverityColor = (severity: string): string => {
        switch (severity) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            default: return '#4caf50';
        }
    };

    const getStatusText = (score: number): string => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Critical';
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🔧 Predictive Maintenance</h1>

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
                <button onClick={() => setShowAddForm(!showAddForm)} style={styles.addRecordBtn}>
                    + Add Maintenance Record
                </button>
            </div>

            {/* Add Record Form */}
            {showAddForm && (
                <div style={styles.formContainer}>
                    <h3>Add Maintenance Record</h3>
                    <div style={styles.formGrid}>
                        <select
                            value={newRecord.component}
                            onChange={(e) => setNewRecord({ ...newRecord, component: e.target.value })}
                            style={styles.input}
                        >
                            <option value="engine">Engine</option>
                            <option value="transmission">Transmission</option>
                            <option value="brakes">Brakes</option>
                            <option value="tires">Tires</option>
                            <option value="battery">Battery</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Service Type"
                            value={newRecord.serviceType}
                            onChange={(e) => setNewRecord({ ...newRecord, serviceType: e.target.value })}
                            style={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Mileage"
                            value={newRecord.mileage}
                            onChange={(e) => setNewRecord({ ...newRecord, mileage: e.target.value })}
                            style={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Cost ($)"
                            value={newRecord.cost}
                            onChange={(e) => setNewRecord({ ...newRecord, cost: e.target.value })}
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newRecord.description}
                            onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                            style={styles.input}
                        />
                        <select
                            value={newRecord.severity}
                            onChange={(e) => setNewRecord({ ...newRecord, severity: e.target.value })}
                            style={styles.input}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button onClick={addMaintenanceRecord} style={styles.submitBtn}>Save Record</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={styles.loader}>Analyzing vehicle data...</div>
            ) : analysis ? (
                <div>
                    {/* Health Score Card */}
                    <div style={{ ...styles.healthCard, backgroundColor: getHealthColor(analysis.healthScore) }}>
                        <div style={styles.healthCardContent}>
                            <div>
                                <h2 style={styles.healthTitle}>Overall Vehicle Health</h2>
                                <div style={styles.healthScore}>{analysis.healthScore}/100</div>
                                <div style={styles.healthStatus}>{analysis.healthStatus}</div>
                            </div>
                            <div style={styles.healthStats}>
                                <div>Total Maintenance: ${totalCost.toLocaleString()}</div>
                                <div>Records: {records.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Component Health */}
                    <h2 style={styles.sectionTitle}>Component Health Analysis</h2>
                    <div style={styles.componentsGrid}>
                        {Object.entries(analysis.predictions).map(([key, value]) => (
                            <div key={key} style={styles.componentCard}>
                                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                                <div style={styles.componentScore}>{value}%</div>
                                <div style={styles.progressBar}>
                                    <div style={{ ...styles.progressFill, width: `${value}%`, backgroundColor: getHealthColor(value) }}></div>
                                </div>
                                <div style={styles.componentStatus}>{getStatusText(value)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Maintenance Schedule */}
                    <h2 style={styles.sectionTitle}>Maintenance Schedule</h2>
                    <div style={styles.scheduleGrid}>
                        {analysis.maintenanceSchedule.map((item, idx) => (
                            <div key={idx} style={styles.scheduleCard}>
                                <div style={{ ...styles.scheduleHeader, backgroundColor: getPriorityColor(item.priority) }}>
                                    <span>{item.service}</span>
                                    <span style={styles.schedulePriority}>{item.priority}</span>
                                </div>
                                <div style={styles.scheduleBody}>
                                    <div>Due at: <strong>{item.dueMiles.toLocaleString()} miles</strong></div>
                                    <div>Est. Cost: <strong>${item.estimatedCost}</strong></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <h2 style={styles.sectionTitle}>AI Recommendations</h2>
                    <ul style={styles.recommendationsList}>
                        {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} style={styles.recommendationItem}>✅ {rec}</li>
                        ))}
                    </ul>

                    {/* Maintenance History */}
                    <h2 style={styles.sectionTitle}>Maintenance History</h2>
                    {records.length === 0 ? (
                        <div style={styles.emptyState}>No maintenance records yet.</div>
                    ) : (
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeader}>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Component</th>
                                        <th style={styles.th}>Service</th>
                                        <th style={styles.th}>Mileage</th>
                                        <th style={styles.th}>Cost</th>
                                        <th style={styles.th}>Severity</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record.id}>
                                            <td style={styles.td}>{new Date(record.performedAt).toLocaleDateString()}</td>
                                            <td style={styles.td}>{record.component}</td>
                                            <td style={styles.td}>{record.serviceType}</td>
                                            <td style={styles.td}>{record.mileage.toLocaleString()}</td>
                                            <td style={styles.td}>${record.cost}</td>
                                            <td style={styles.td}>
                                                <span style={{ ...styles.severityBadge, backgroundColor: getSeverityColor(record.severity) }}>
                                                    {record.severity}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <button onClick={() => deleteRecord(record.id)} style={styles.deleteSmallBtn}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div style={styles.loader}>Select a vehicle to see predictive analysis</div>
            )}
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
        marginBottom: '20px'
    },
    selectorContainer: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    select: {
        flex: 1,
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    addRecordBtn: {
        padding: '12px 24px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    formContainer: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginTop: '10px'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    submitBtn: {
        padding: '10px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    loader: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px'
    },
    healthCard: {
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        color: 'white'
    },
    healthCardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
    },
    healthTitle: {
        margin: 0,
        fontSize: '18px'
    },
    healthScore: {
        fontSize: '48px',
        fontWeight: 'bold'
    },
    healthStatus: {
        fontSize: '14px',
        opacity: 0.9
    },
    healthStats: {
        textAlign: 'right'
    },
    sectionTitle: {
        marginTop: '30px',
        marginBottom: '20px',
        color: '#333'
    },
    componentsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    componentCard: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center'
    },
    componentScore: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '10px 0'
    },
    progressBar: {
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s'
    },
    componentStatus: {
        marginTop: '8px',
        fontSize: '12px',
        color: '#666'
    },
    scheduleGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
    },
    scheduleCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    scheduleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px',
        color: 'white'
    },
    schedulePriority: {
        padding: '2px 8px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
        fontSize: '12px'
    },
    scheduleBody: {
        padding: '12px',
        backgroundColor: '#fff'
    },
    recommendationsList: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '30px'
    },
    recommendationItem: {
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
        borderLeft: '4px solid #4caf50'
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
        border: '1px solid #ddd'
    },
    severityBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px'
    },
    deleteSmallBtn: {
        padding: '4px 8px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
    }
};

export default Maintenance;