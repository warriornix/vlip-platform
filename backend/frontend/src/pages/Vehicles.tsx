import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Vehicle {
    id: string;
    vin: string;
    manufacturer: string;
    model: string;
    year: number;
    healthScore?: number;
    lastMaintenance?: string;
    maintenanceCount?: number;
}

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterManufacturer, setFilterManufacturer] = useState('');
    const [manufacturers, setManufacturers] = useState<string[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        vin: '',
        manufacturer: '',
        model: '',
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filterVehicles = () => {
        let filtered = [...vehicles];
        
        if (searchTerm) {
            filtered = filtered.filter(v => 
                v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filterManufacturer) {
            filtered = filtered.filter(v => v.manufacturer === filterManufacturer);
        }
        
        setFilteredVehicles(filtered);
    };

    useEffect(() => {
        filterVehicles();
    }, [searchTerm, filterManufacturer, vehicles]);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/vehicles');
            const vehiclesData = response.data.vehicles || [];
            
            const vehiclesWithHealth = await Promise.all(vehiclesData.map(async (v: Vehicle) => {
                try {
                    const predictiveRes = await api.get(`/maintenance/predictive/${v.id}`);
                    const historyRes = await api.get(`/maintenance/history/${v.id}`);
                    return {
                        ...v,
                        healthScore: predictiveRes.data.analysis?.healthScore || 85,
                        maintenanceCount: historyRes.data.records?.length || 0,
                        lastMaintenance: historyRes.data.records?.[0]?.performedAt
                    };
                } catch {
                    return { ...v, healthScore: 85, maintenanceCount: 0 };
                }
            }));
            
            setVehicles(vehiclesWithHealth);
            setFilteredVehicles(vehiclesWithHealth);
            
            const uniqueManufacturers: string[] = [];
            vehiclesWithHealth.forEach(v => {
                if (!uniqueManufacturers.includes(v.manufacturer)) {
                    uniqueManufacturers.push(v.manufacturer);
                }
            });
            setManufacturers(uniqueManufacturers);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const addVehicle = async () => {
        if (!newVehicle.vin || !newVehicle.manufacturer || !newVehicle.model) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await api.post('/vehicles', newVehicle);
            setNewVehicle({ vin: '', manufacturer: '', model: '', year: new Date().getFullYear() });
            setShowAddForm(false);
            fetchVehicles();
            alert('Vehicle added successfully!');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to add vehicle');
        }
    };

    const deleteVehicle = async (id: string) => {
        if (window.confirm('Delete this vehicle?')) {
            try {
                await api.delete(`/vehicles/${id}`);
                fetchVehicles();
                alert('Vehicle deleted!');
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    const exportToCSV = () => {
        const headers = ['VIN', 'Manufacturer', 'Model', 'Year', 'Health Score', 'Maintenance Records'];
        const rows = filteredVehicles.map(v => [
            v.vin, v.manufacturer, v.model, v.year, v.healthScore || 85, v.maintenanceCount || 0
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicles_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return '#4caf50';
        if (score >= 60) return '#ff9800';
        return '#f44336';
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading vehicles...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ color: '#1976d2' }}>🚗 Vehicle Management</h1>
                <div>
                    <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {showAddForm ? 'Cancel' : '+ Add Vehicle'}
                    </button>
                    {filteredVehicles.length > 0 && (
                        <button onClick={exportToCSV} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            📊 Export CSV
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 2, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <select value={filterManufacturer} onChange={(e) => setFilterManufacturer(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="">All Manufacturers</option>
                    {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button onClick={() => { setSearchTerm(''); setFilterManufacturer(''); }} style={{ padding: '10px 20px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
            </div>

            {showAddForm && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3>Add New Vehicle</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        <input type="text" placeholder="VIN" value={newVehicle.vin} onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value.toUpperCase() })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <input type="text" placeholder="Manufacturer" value={newVehicle.manufacturer} onChange={(e) => setNewVehicle({ ...newVehicle, manufacturer: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <input type="text" placeholder="Model" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <input type="number" placeholder="Year" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <button onClick={addVehicle} style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Vehicle</button>
                    </div>
                </div>
            )}

            {filteredVehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>No vehicles found.</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>VIN</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Manufacturer</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Model</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Year</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Health</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.vin}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.manufacturer}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.model}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.year}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', color: 'white', backgroundColor: getHealthColor(vehicle.healthScore || 85) }}>
                                        {vehicle.healthScore || 85}%
                                    </span>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    <button onClick={() => deleteVehicle(vehicle.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Vehicles;