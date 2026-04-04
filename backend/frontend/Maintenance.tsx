import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Vehicle, PredictiveAnalysis } from '../types';

const Maintenance: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
    const [analysis, setAnalysis] = useState<PredictiveAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicle) {
            fetchPredictiveAnalysis();
        }
    }, [selectedVehicle]);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/vehicles');
            setVehicles(response.data.vehicles);
            if (response.data.vehicles.length > 0) {
                setSelectedVehicle(response.data.vehicles[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    const fetchPredictiveAnalysis = async () => {
        if (!selectedVehicle) return;
        
        setLoading(true);
        try {
            const response = await api.get(`/maintenance/predictive/${selectedVehicle}`);
            setAnalysis(response.data);
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHealthColor = (score: number): "success" | "info" | "warning" | "error" => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'info';
        if (score >= 40) return 'warning';
        return 'error';
    };

    const getUrgencyColor = (urgency: string): "error" | "warning" | "info" | "default" => {
        switch (urgency) {
            case 'Critical': return 'error';
            case 'High': return 'warning';
            case 'Medium': return 'info';
            default: return 'default';
        }
    };

    if (vehicles.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>No vehicles found. Please add a vehicle first.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Predictive Maintenance
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Select Vehicle:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {vehicles.map((vehicle) => (
                        <Chip
                            key={vehicle.id}
                            label={`${vehicle.manufacturer} ${vehicle.model}`}
                            onClick={() => setSelectedVehicle(vehicle.id)}
                            color={selectedVehicle === vehicle.id ? 'primary' : 'default'}
                            variant={selectedVehicle === vehicle.id ? 'filled' : 'outlined'}
                        />
                    ))}
                </Box>
            </Paper>

            {loading && <LinearProgress />}

            {analysis && (
                <>
                    <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Overall Vehicle Health
                            </Typography>
                            <Typography variant="h2">
                                {analysis.healthScore}/100
                            </Typography>
                            <Typography variant="subtitle1">
                                Status: {analysis.healthStatus}
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={analysis.healthScore} 
                                sx={{ mt: 2, height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.3)' }}
                            />
                        </CardContent>
                    </Card>

                    <Typography variant="h5" gutterBottom>
                        Component Health Analysis
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {analysis.predictions.map((pred, idx) => (
                            <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {pred.component}
                                        </Typography>
                                        <Typography variant="h3" color={getHealthColor(pred.currentHealth)}>
                                            {pred.currentHealth}%
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={pred.currentHealth} 
                                            sx={{ mt: 1, mb: 2, height: 8 }}
                                            color={getHealthColor(pred.currentHealth)}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            {pred.recommendedAction}
                                        </Typography>
                                        <Chip 
                                            label={pred.urgency} 
                                            color={getUrgencyColor(pred.urgency)}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                        {pred.estimatedCost > 0 && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Est. Cost: ${pred.estimatedCost}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="h5" gutterBottom>
                        Maintenance Schedule
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Due at (miles)</TableCell>
                                    <TableCell>Miles Remaining</TableCell>
                                    <TableCell>Est. Cost</TableCell>
                                    <TableCell>Priority</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {analysis.maintenanceSchedule.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.service}</TableCell>
                                        <TableCell>{item.nextDueMiles.toLocaleString()}</TableCell>
                                        <TableCell>{item.milesRemaining.toLocaleString()}</TableCell>
                                        <TableCell>${item.estimatedCost}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.priority} 
                                                color={item.priority === 'High' ? 'error' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h5" gutterBottom>
                        AI Recommendations
                    </Typography>
                    {analysis.recommendations.map((rec, idx) => (
                        <Alert severity="info" key={idx} sx={{ mb: 2 }}>
                            {rec}
                        </Alert>
                    ))}
                </>
            )}
        </Container>
    );
};

export default Maintenance;