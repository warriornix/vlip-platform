const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function forceUpdate() {
    try {
        // Find the admin user
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });
        
        if (!admin) {
            console.log('Admin user not found! Creating one...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            const newAdmin = await prisma.user.create({
                data: {
                    email: 'admin@example.com',
                    password: hashedPassword,
                    name: 'System Admin',
                    role: 'ADMIN'
                }
            });
            console.log('Created new admin:', newAdmin.email, 'Role:', newAdmin.role);
        } else {
            console.log('Found user:', admin.email, 'Current role:', admin.role);
            
            // Update role to ADMIN
            const updated = await prisma.user.update({
                where: { id: admin.id },
                data: { role: 'ADMIN' }
            });
            
            console.log('Updated user:', updated.email, 'New role:', updated.role);
        }
        
        // Verify it worked
        const verify = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });
        console.log('Verification:', verify.email, 'Role:', verify.role);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

forceUpdate();