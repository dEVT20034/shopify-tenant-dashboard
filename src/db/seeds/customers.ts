import { db } from '@/db';
import { customers } from '@/db/schema';

async function main() {
    const sampleCustomers = [
        {
            shopifyCustomerId: 'shopify_cust_001',
            email: 'alice.johnson@email.com',
            name: 'Alice Johnson',
            totalSpent: 349.97,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyCustomerId: 'shopify_cust_002',
            email: 'bob.williams@email.com',
            name: 'Bob Williams',
            totalSpent: 127.98,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyCustomerId: 'shopify_cust_003',
            email: 'carol.davis@email.com',
            name: 'Carol Davis',
            totalSpent: 579.95,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyCustomerId: 'shopify_cust_004',
            email: 'david.brown@email.com',
            name: 'David Brown',
            totalSpent: 89.99,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyCustomerId: 'shopify_cust_101',
            email: 'emma.wilson@email.com',
            name: 'Emma Wilson',
            totalSpent: 189.98,
            tenantId: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyCustomerId: 'shopify_cust_102',
            email: 'frank.miller@email.com',
            name: 'Frank Miller',
            totalSpent: 529.98,
            tenantId: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(customers).values(sampleCustomers);
    
    console.log('✅ Customers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});