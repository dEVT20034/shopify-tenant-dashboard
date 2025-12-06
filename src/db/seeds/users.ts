import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const sampleUsers = [
        {
            email: 'john@acmestore.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: bcrypt.hashSync('password123', 10),
            role: 'admin',
            tenantId: 1,
            createdAt: new Date().toISOString(),
        },
        {
            email: 'sarah@acmestore.com',
            firstName: 'Sarah',
            lastName: 'Smith',
            passwordHash: bcrypt.hashSync('password123', 10),
            role: 'admin',
            tenantId: 1,
            createdAt: new Date().toISOString(),
        },
        {
            email: 'mike@techgearshop.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            passwordHash: bcrypt.hashSync('password123', 10),
            role: 'admin',
            tenantId: 2,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});