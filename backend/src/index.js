const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorize } = require('./middleware/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory storage
const users = [];
const vehicles = [];
const certificates = [];

// Initialize admin user on startup
(async () => {
    const existingAdmin = users.find(u => u.email === 'admin@example.com');
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        users.push({
            id: 1,
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN',
            createdAt: new Date().toISOString()
        });
        console.log('✅ Admin user created');
    }
    
    const existingManager = users.find(u => u.email === 'manager@example.com');
    if (!existingManager) {
        const hashedPassword = await bcrypt.hash('manager123', 10);
        users.push({
            id: 2,
            email: 'manager@example.com',
            password: hashedPassword,
            name: 'Fleet Manager',
            role: 'MANAGER',
            createdAt: new Date().toISOString()
        });
        console.log('✅ Manager user created');
    }
    
    const existingDriver = users.find(u => u.email === 'driver@example.com');
    if (!existingDriver) {
        const hashedPassword = await bcrypt.hash('driver123', 10);
        users.push({
            id: 3,
            email: 'driver@example.com',
            password: hashedPassword,
            name: 'John Driver',
            role: 'DRIVER',
            createdAt: new Date().toISOString()
        });
        console.log('✅ Driver user created');
    }
    
    // Sample vehicles
    if (vehicles.length === 0) {
        vehicles.push(
            { id: 1, name: 'Honda Accord', mileage: 50000, userId: 3, status: 'active' },
            { id: 2, name: 'Toyota Camry', mileage: 35000, userId: 3, status: 'active' },
            { id: 3, name: 'Ford Transit', mileage: 75000, userId: 2, status: 'active' },
            { id: 4, name: 'Tesla Model 3', mileage: 15000, userId: 2, status: 'active' }
        );
        console.log('✅ Sample vehicles created');
    }
})();

// Health check (public)
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register (public)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role = 'DRIVER' } = req.body;
        
        const existing = users.find(u => u.email === email);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name: name || email.split('@')[0],
            role,
            createdAt: new Date().toISOString()
        };
        users.push(user);
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login (public)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user profile (authenticated)
app.get('/api/auth/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
});

// Get all users (ADMIN only)
app.get('/api/users', authenticateToken, authorize('ADMIN'), (req, res) => {
    const allUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt
    }));
    res.json({ success: true, users: allUsers });
});

// Update user role (ADMIN only)
app.put('/api/users/:id/role', authenticateToken, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.role = role;
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Delete user (ADMIN only)
app.delete('/api/users/:id', authenticateToken, authorize('ADMIN'), (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    if (users[index].id === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    users.splice(index, 1);
    res.json({ success: true, message: 'User deleted successfully' });
});

// Get vehicles (ADMIN and MANAGER see all, DRIVER sees only assigned)
app.get('/api/vehicles', authenticateToken, (req, res) => {
    let userVehicles;
    
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
        userVehicles = vehicles;
    } else {
        userVehicles = vehicles.filter(v => v.userId === req.user.id);
    }
    
    res.json({ success: true, vehicles: userVehicles });
});

// Create vehicle (ADMIN and MANAGER can create)
app.post('/api/vehicles', authenticateToken, authorize('ADMIN', 'MANAGER'), (req, res) => {
    const { name, mileage, userId } = req.body;
    
    const newVehicle = {
        id: vehicles.length + 1,
        name,
        mileage: mileage || 0,
        userId: userId || req.user.id,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    vehicles.push(newVehicle);
    res.status(201).json({ success: true, vehicle: newVehicle });
});

// Update vehicle (ADMIN and MANAGER can update)
app.put('/api/vehicles/:id', authenticateToken, authorize('ADMIN', 'MANAGER'), (req, res) => {
    const { id } = req.params;
    const { name, mileage } = req.body;
    
    const vehicle = vehicles.find(v => v.id === parseInt(id));
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    if (name) vehicle.name = name;
    if (mileage) vehicle.mileage = mileage;
    vehicle.updatedAt = new Date().toISOString();
    
    res.json({ success: true, vehicle });
});

// Delete vehicle (ADMIN only)
app.delete('/api/vehicles/:id', authenticateToken, authorize('ADMIN'), (req, res) => {
    const { id } = req.params;
    const index = vehicles.findIndex(v => v.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    vehicles.splice(index, 1);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
});

// Get fleet stats (ADMIN and MANAGER)
app.get('/api/analytics/fleet-stats', authenticateToken, authorize('ADMIN', 'MANAGER'), (req, res) => {
    const totalVehicles = vehicles.length;
    const totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0);
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    
    res.json({
        success: true,
        stats: {
            totalVehicles,
            totalMileage,
            activeVehicles,
            averageMileage: totalVehicles ? Math.round(totalMileage / totalVehicles) : 0
        }
    });
});

// Get certificates (ADMIN and MANAGER see all, DRIVER sees own)
app.get('/api/certificates', authenticateToken, (req, res) => {
    let userCertificates;
    
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
        userCertificates = certificates;
    } else {
        userCertificates = certificates.filter(c => c.userId === req.user.id);
    }
    
    res.json({ success: true, certificates: userCertificates });
});

// Issue certificate (ADMIN and MANAGER)
app.post('/api/certificates', authenticateToken, authorize('ADMIN', 'MANAGER'), (req, res) => {
    const { vehicleId, type } = req.body;
    
    const certificate = {
        id: certificates.length + 1,
        certificateId: `CERT-${Date.now()}-${vehicleId}`,
        vehicleId,
        type: type || 'Birth Certificate',
        issuedBy: req.user.id,
        issuedAt: new Date().toISOString(),
        blockchainHash: `0x${Buffer.from(vehicleId + Date.now()).toString('hex').substring(0, 64)}`,
        status: 'active'
    };
    
    certificates.push(certificate);
    res.status(201).json({ success: true, certificate });
});

// Dashboard stats based on role
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    const stats = {};
    
    if (req.user.role === 'ADMIN') {
        stats.totalUsers = users.length;
        stats.totalVehicles = vehicles.length;
        stats.totalCertificates = certificates.length;
        stats.admins = users.filter(u => u.role === 'ADMIN').length;
        stats.managers = users.filter(u => u.role === 'MANAGER').length;
        stats.drivers = users.filter(u => u.role === 'DRIVER').length;
    } else if (req.user.role === 'MANAGER') {
        stats.totalVehicles = vehicles.length;
        stats.totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0);
        stats.activeVehicles = vehicles.filter(v => v.status === 'active').length;
        stats.recentAlerts = 2;
    } else {
        const userVehicles = vehicles.filter(v => v.userId === req.user.id);
        stats.assignedVehicles = userVehicles.length;
        stats.totalMileage = userVehicles.reduce((sum, v) => sum + v.mileage, 0);
        stats.safetyAlerts = 1;
        stats.nextService = userVehicles[0]?.mileage ? 50000 - userVehicles[0].mileage : 5000;
    }
    
    res.json({ success: true, stats, role: req.user.role });
});

app.listen(PORT, () => {
    console.log(`🚀 VLIP Backend running on port ${PORT}`);
    console.log(`   Admin: admin@example.com / admin123`);
    console.log(`   Manager: manager@example.com / manager123`);
    console.log(`   Driver: driver@example.com / driver123`);
});