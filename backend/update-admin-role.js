const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminRole() {
    try {
        // Find the admin user
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });
        
        if (!admin) {
            console.log('Admin user not found!');
            return;
        }
        
        // Update role to ADMIN
        const updated = await prisma.user.update({
            where: { id: admin.id },
            data: { role: 'ADMIN' }
        });
        
        console.log(`Updated user ${updated.email} to role: ${updated.role}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminRole();