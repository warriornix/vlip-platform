import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Chip,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { ArrowBack, QrCode, Receipt, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { ReportService } from '../services/reportService';
import { Vehicle, Certificate } from '../types';

const VehicleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [openCertDialog, setOpenCertDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVehicle();
        fetchCertificates();
    }, [id]);

    const fetchVehicle = async () => {
        try {
            const response = await api.get(`/vehicles/${id}`);
            setVehicle(response.data.vehicle);
        } catch (error) {
            console.error('Failed to fetch vehicle:', error);
        }
    };

    const fetchCertificates = async () => {
        try {
            const response = await api.get(`/certificates/vehicle/${id}/certificates`);
            setCertificates(response.data.certificates);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        }
    };

    const issueCertificate = async () => {
        try {
            await api.post(`/certificates/vehicle/${id}/issue`);
            fetchCertificates();
            setOpenCertDialog(false);
        } catch (error) {
            console.error('Failed to issue certificate:', error);
        }
    };

    const verifyCertificate = async (certId: string) => {
        try {
            const response = await api.get(`/certificates/verify/${certId}`);
            alert(`Certificate Status: ${response.data.verificationStatus}`);
        } catch (error) {
            console.error('Failed to verify certificate:', error);
        }
    };

    const handleExportHealthReport = async () => {
        if (!vehicle || !id) return;
        setLoading(true);
        try {
            const analysisResponse = await api.get(`/maintenance/predictive/${id}`);
            ReportService.generateVehicleHealthReport(vehicle, analysisResponse.data);
        } catch (error) {
            console.error('Failed to generate health report:', error);
            alert('Failed to generate health report');
        } finally {
            setLoading(false);
        }
    };

    const handleExportMaintenanceHistory = async () => {
        if (!vehicle || !id) return;
        setLoading(true);
        try {
            const historyResponse = await api.get(`/maintenance/history/${id}`);
            ReportService.generateMaintenanceHistoryReport(vehicle, historyResponse.data.records);
        } catch (error) {
            console.error('Failed to generate maintenance report:', error);
            alert('Failed to generate maintenance report');
        } finally {
            setLoading(false);
        }
    };

    if (!vehicle) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate('/vehicles')} sx={{ mb: 2 }}>
                Back to Vehicles
            </Button>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {vehicle.manufacturer} {vehicle.model}
                </Typography>
                
                {/* Report Export Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PdfIcon />}
                        onClick={handleExportHealthReport}
                        disabled={loading}
                    >
                        Export Health Report
                    </Button>
                    
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PdfIcon />}
                        onClick={handleExportMaintenanceHistory}
                        disabled={loading}
                    >
                        Export Maintenance History
                    </Button>
                </Box>
                
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" color="textSecondary">VIN</Typography>
                        <Typography variant="body1">{vehicle.vin}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" color="textSecondary">Year</Typography>
                        <Typography variant="body1">{vehicle.year}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Digital Certificates
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Receipt />}
                    onClick={() => setOpenCertDialog(true)}
                    sx={{ mb: 2 }}
                >
                    Issue New Certificate
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Certificate ID</TableCell>
                                <TableCell>Issued At</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Blockchain Hash</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {certificates.map((cert) => (
                                <TableRow key={cert.id}>
                                    <TableCell>{cert.certificateId}</TableCell>
                                    <TableCell>{new Date(cert.issuedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={cert.status} 
                                            color={cert.status === 'active' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {cert.blockchainHash?.substring(0, 20)}...
                                    </TableCell>
                                    <TableCell>
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => verifyCertificate(cert.certificateId)}
                                        >
                                            <QrCode />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {certificates.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No certificates issued yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={openCertDialog} onClose={() => setOpenCertDialog(false)}>
                <DialogTitle>Issue Digital Certificate</DialogTitle>
                <DialogContent>
                    <Typography>
                        This will create a blockchain-verified digital birth certificate for this vehicle.
                        The certificate will be hashed and stored with a unique blockchain ID.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCertDialog(false)}>Cancel</Button>
                    <Button onClick={issueCertificate} variant="contained" color="primary">
                        Issue Certificate
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VehicleDetail;