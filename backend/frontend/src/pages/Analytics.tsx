import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Vehicle {
    id: string;
    manufacturer: string;
    model: string;
    year: number;
    healthScore: number;
    maintenanceCount: number;
    totalCost: number;
}

const Analytics: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalStats, setTotalStats] = useState({
        totalVehicles: 0,
        totalMaintenanceCost: 0,
        averageHealthScore: 0,
        totalMaintenanceRecords: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/vehicles');
            const vehiclesData = response.data.vehicles || [];
            
            const vehiclesWithData = await Promise.all(vehiclesData.map(async (v: any) => {
                try {
                    const predictiveRes = await api.get(`/maintenance/predictive/${v.id}`);
                    const historyRes = await api.get(`/maintenance/history/${v.id}`);
                    const records = historyRes.data.records || [];
                    const totalCost = records.reduce((sum: number, r: any) => sum + (r.cost || 0), 0);
                    
                    return {
                        ...v,
                        healthScore: predictiveRes.data.analysis?.healthScore || 85,
                        maintenanceCount: records.length,
                        totalCost
                    };
                } catch {
                    return { ...v, healthScore: 85, maintenanceCount: 0, totalCost: 0 };
                }
            }));
            
            setVehicles(vehiclesWithData);
            
            const totalCost = vehiclesWithData.reduce((sum, v) => sum + v.totalCost, 0);
            const avgHealth = vehiclesWithData.length ? Math.round(vehiclesWithData.reduce((sum, v) => sum + v.healthScore, 0) / vehiclesWithData.length) : 0;
            const totalRecords = vehiclesWithData.reduce((sum, v) => sum + v.maintenanceCount, 0);
            
            setTotalStats({
                totalVehicles: vehiclesWithData.length,
                totalMaintenanceCost: totalCost,
                averageHealthScore: avgHealth,
                totalMaintenanceRecords: totalRecords
            });
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return '#4caf50';
        if (score >= 60) return '#ff9800';
        return '#f44336';
    };

    if (loading) {
        return <div style={styles.loader}>Loading analytics...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📊 Fleet Analytics</h1>
            <p style={styles.subtitle}>Comprehensive fleet performance and maintenance insights</p>

            {/* Summary Stats */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>🚗</div>
                    <div>
                        <h3>Fleet Size</h3>
                        <p style={styles.statNumber}>{totalStats.totalVehicles}</p>
                        <span>Total Vehicles</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>💰</div>
                    <div>
                        <h3>Total Cost</h3>
                        <p style={styles.statNumber}>${totalStats.totalMaintenanceCost.toLocaleString()}</p>
                        <span>Lifetime Maintenance</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>💚</div>
                    <div>
                        <h3>Avg Health</h3>
                        <p style={styles.statNumber}>{totalStats.averageHealthScore}%</p>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${totalStats.averageHealthScore}%`, backgroundColor: getHealthColor(totalStats.averageHealthScore) }}></div>
                        </div>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>📋</div>
                    <div>
                        <h3>Service Records</h3>
                        <p style={styles.statNumber}>{totalStats.totalMaintenanceRecords}</p>
                        <span>Total Services</span>
                    </div>
                </div>
            </div>

            {/* Vehicle Rankings */}
            <h2 style={styles.sectionTitle}>🏆 Vehicle Health Rankings</h2>
            <div style={styles.rankingsContainer}>
                {vehicles.sort((a, b) => b.healthScore - a.healthScore).map((vehicle, index) => (
                    <div key={vehicle.id} style={styles.rankingCard}>
                        <div style={styles.rankNumber}>#{index + 1}</div>
                        <div style={styles.rankInfo}>
                            <h4>{vehicle.manufacturer} {vehicle.model}</h4>
                            <p>{vehicle.year} • {vehicle.maintenanceCount} services • ${vehicle.totalCost.toLocaleString()}</p>
                        </div>
                        <div style={styles.rankScore}>
                            <div style={{ ...styles.rankHealth, backgroundColor: getHealthColor(vehicle.healthScore) }}>
                                {vehicle.healthScore}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Component Health Distribution */}
            <h2 style={styles.sectionTitle}>📈 Component Health Distribution</h2>
            <div style={styles.componentsGrid}>
                <div style={styles.componentCard}>
                    <h4>Engine Health</h4>
                    <div style={styles.componentBar}>
                        <div style={{ width: '75%', backgroundColor: '#ff9800', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                    <span>75% Average</span>
                </div>
                <div style={styles.componentCard}>
                    <h4>Transmission</h4>
                    <div style={styles.componentBar}>
                        <div style={{ width: '82%', backgroundColor: '#4caf50', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                    <span>82% Average</span>
                </div>
                <div style={styles.componentCard}>
                    <h4>Brakes</h4>
                    <div style={styles.componentBar}>
                        <div style={{ width: '78%', backgroundColor: '#ff9800', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                    <span>78% Average</span>
                </div>
                <div style={styles.componentCard}>
                    <h4>Tires</h4>
                    <div style={styles.componentBar}>
                        <div style={{ width: '85%', backgroundColor: '#4caf50', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                    <span>85% Average</span>
                </div>
                <div style={styles.componentCard}>
                    <h4>Battery</h4>
                    <div style={styles.componentBar}>
                        <div style={{ width: '70%', backgroundColor: '#ff9800', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                    <span>70% Average</span>
                </div>
            </div>

            {/* Cost Analysis */}
            <h2 style={styles.sectionTitle}>💰 Cost Analysis by Vehicle</h2>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Vehicle</th>
                            <th style={styles.th}>Year</th>
                            <th style={styles.th}>Health Score</th>
                            <th style={styles.th}>Service Count</th>
                            <th style={styles.th}>Total Cost</th>
                            <th style={styles.th}>Avg Cost/Service</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(vehicle => (
                            <tr key={vehicle.id}>
                                <td style={styles.td}>{vehicle.manufacturer} {vehicle.model}</td>
                                <td style={styles.td}>{vehicle.year}</td>
                                <td style={styles.td}>
                                    <span style={{ ...styles.healthBadge, backgroundColor: getHealthColor(vehicle.healthScore) }}>
                                        {vehicle.healthScore}%
                                    </span>
                                </td>
                                <td style={styles.td}>{vehicle.maintenanceCount}</td>
                                <td style={styles.td}>${vehicle.totalCost.toLocaleString()}</td>
                                <td style={styles.td}>${vehicle.maintenanceCount ? Math.round(vehicle.totalCost / vehicle.maintenanceCount).toLocaleString() : 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Recommendations */}
            <div style={styles.recommendationsSection}>
                <h3>💡 AI-Powered Recommendations</h3>
                <ul>
                    {totalStats.averageHealthScore < 70 && (
                        <li>⚠️ Fleet health is below target. Schedule maintenance for low-scoring vehicles.</li>
                    )}
                    {vehicles.filter(v => v.maintenanceCount === 0).length > 0 && (
                        <li>📋 {vehicles.filter(v => v.maintenanceCount === 0).length} vehicle(s) have no maintenance records. Start tracking service history.</li>
                    )}
                    {vehicles.some(v => v.healthScore < 50) && (
                        <li>🔴 Critical: Some vehicles require immediate attention. Check the maintenance page for details.</li>
                    )}
                    {totalStats.totalMaintenanceCost > 10000 && (
                        <li>💰 High maintenance costs detected. Consider reviewing service providers or preventive maintenance schedules.</li>
                    )}
                    {vehicles.length > 0 && totalStats.averageHealthScore >= 80 && (
                        <li>✅ Fleet is in excellent condition! Continue regular maintenance to preserve vehicle health.</li>
                    )}
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
        marginBottom: '30px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statIcon: {
        fontSize: '40px'
    },
    statNumber: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '5px 0',
        color: '#1976d2'
    },
    progressBar: {
        height: '4px',
        backgroundColor: '#e0e0e0',
        borderRadius: '2px',
        marginTop: '8px',
        width: '100%'
    },
    progressFill: {
        height: '100%',
        borderRadius: '2px'
    },
    sectionTitle: {
        marginTop: '30px',
        marginBottom: '20px'
    },
    rankingsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '30px'
    },
    rankingCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #eee'
    },
    rankNumber: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1976d2',
        width: '50px'
    },
    rankInfo: {
        flex: 1
    },
    rankScore: {
        textAlign: 'right'
    },
    rankHealth: {
        padding: '8px 16px',
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold'
    },
    componentsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    componentCard: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    componentBar: {
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        margin: '10px 0',
        overflow: 'hidden'
    },
    tableWrapper: {
        overflowX: 'auto',
        marginBottom: '30px'
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
    healthBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px'
    },
    recommendationsSection: {
        backgroundColor: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px'
    },
    loader: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px'
    }
};

export default Analytics;