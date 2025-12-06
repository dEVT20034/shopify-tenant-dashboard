import { db } from '@/db';
import { products } from '@/db/schema';

async function main() {
    const sampleProducts = [
        {
            shopifyProductId: 'shopify_prod_001',
            title: 'Wireless Headphones',
            price: 79.99,
            inventory: 45,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_002',
            title: 'Smart Watch',
            price: 199.99,
            inventory: 23,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_003',
            title: 'USB-C Cable',
            price: 12.99,
            inventory: 150,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_004',
            title: 'Laptop Stand',
            price: 34.99,
            inventory: 67,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_005',
            title: 'Bluetooth Speaker',
            price: 49.99,
            inventory: 88,
            tenantId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_101',
            title: 'Gaming Mouse',
            price: 59.99,
            inventory: 34,
            tenantId: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_102',
            title: 'Mechanical Keyboard',
            price: 129.99,
            inventory: 19,
            tenantId: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            shopifyProductId: 'shopify_prod_103',
            title: '4K Monitor',
            price: 399.99,
            inventory: 12,
            tenantId: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(products).values(sampleProducts);
    
    console.log('✅ Products seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});