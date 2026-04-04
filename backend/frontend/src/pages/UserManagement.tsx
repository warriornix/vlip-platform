import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Box,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AdminPanelSettings,
    SupervisorAccount,
    Person,
    Refresh
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'FLEET_MANAGER' | 'DRIVER';
    createdAt: string;
    _count?: {
        vehicles: number;
    };
}

const UserManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'DRIVER' as 'ADMIN' | 'FLEET_MANAGER' | 'DRIVER'
    });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            if (response.data.success) {
                fetchUsers();
                handleCloseDialog();
                alert('User created successfully');
            }
        } catch (error: any) {
            console.error('Failed to create user:', error);
            alert(error.response?.data?.error || 'Failed to create user');
        }
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            const response = await api.put(`/users/${userId}/role`, { role: newRole });
            if (response.data.success) {
                fetchUsers();
                alert('User role updated successfully');
            }
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            if (response.data.success) {
                fetchUsers();
                setDeleteConfirm(null);
                alert('User deleted successfully');
            }
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            alert(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'DRIVER'
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'error';
            case 'FLEET_MANAGER':
                return 'warning';
            default:
                return 'info';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <AdminPanelSettings fontSize="small" />;
            case 'FLEET_MANAGER':
                return <SupervisorAccount fontSize="small" />;
            default:
                return <Person fontSize="small" />;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'Admin';
            case 'FLEET_MANAGER':
                return 'Fleet Manager';
            default:
                return 'Driver';
        }
    };

    if (currentUser?.role !== 'ADMIN') {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Access Denied. Admin privileges required to view this page.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add User
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        System Users
                    </Typography>
                    <IconButton onClick={fetchUsers} size="small">
                        <Refresh />
                    </IconButton>
                </Box>

                {loading && <LinearProgress />}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Vehicles</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} sx={{ 
                                    bgcolor: user.id === currentUser.id ? 'action.hover' : 'inherit'
                                }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: getRoleColor(user.role) + '.main' }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1">
                                                    {user.name}
                                                    {user.id === currentUser.id && (
                                                        <Chip 
                                                            label="You" 
                                                            size="small" 
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            icon={getRoleIcon(user.role)}
                                            label={getRoleLabel(user.role)}
                                            color={getRoleColor(user.role) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {user._count?.vehicles || 0} vehicles
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                disabled={user.id === currentUser.id}
                                                size="small"
                                            >
                                                <MenuItem value="DRIVER">Driver</MenuItem>
                                                <MenuItem value="FLEET_MANAGER">Fleet Manager</MenuItem>
                                                <MenuItem value="ADMIN">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <IconButton
                                            color="error"
                                            onClick={() => setDeleteConfirm(user.id)}
                                            disabled={user.id === currentUser.id}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add/Edit User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Full Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Email Address"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            helperText={editingUser ? "Leave blank to keep current password" : "Password required"}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                label="Role"
                            >
                                <MenuItem value="DRIVER">Driver</MenuItem>
                                <MenuItem value="FLEET_MANAGER">Fleet Manager</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCreateUser} variant="contained">
                        {editingUser ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this user? This action cannot be undone.
                        All vehicles associated with this user will also be deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button 
                        onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm)} 
                        variant="contained" 
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;