import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const sampleOrders = [
        {
            shopifyOrderId: 'shopify_order_001',
            customerId: 1,
            totalPrice: 199.99,
            status: 'completed',
            tenantId: 1,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T14:45:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_002',
            customerId: 1,
            totalPrice: 149.98,
            status: 'completed',
            tenantId: 1,
            createdAt: '2024-01-18T09:15:00Z',
            updatedAt: '2024-01-18T11:20:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_003',
            customerId: 2,
            totalPrice: 127.98,
            status: 'pending',
            tenantId: 1,
            createdAt: '2024-01-20T14:22:00Z',
            updatedAt: '2024-01-20T14:22:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_004',
            customerId: 3,
            totalPrice: 279.97,
            status: 'completed',
            tenantId: 1,
            createdAt: '2024-01-22T16:40:00Z',
            updatedAt: '2024-01-22T18:55:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_005',
            customerId: 3,
            totalPrice: 299.98,
            status: 'shipped',
            tenantId: 1,
            createdAt: '2024-01-25T11:10:00Z',
            updatedAt: '2024-01-26T09:30:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_006',
            customerId: 4,
            totalPrice: 89.99,
            status: 'completed',
            tenantId: 1,
            createdAt: '2024-01-28T13:45:00Z',
            updatedAt: '2024-01-28T15:20:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_007',
            customerId: null,
            totalPrice: 34.99,
            status: 'cancelled',
            tenantId: 1,
            createdAt: '2024-01-30T08:25:00Z',
            updatedAt: '2024-01-30T10:15:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_101',
            customerId: 5,
            totalPrice: 189.98,
            status: 'completed',
            tenantId: 2,
            createdAt: '2024-01-16T12:00:00Z',
            updatedAt: '2024-01-16T15:30:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_102',
            customerId: 6,
            totalPrice: 399.99,
            status: 'shipped',
            tenantId: 2,
            createdAt: '2024-01-19T10:45:00Z',
            updatedAt: '2024-01-20T08:20:00Z',
        },
        {
            shopifyOrderId: 'shopify_order_103',
            customerId: 6,
            totalPrice: 129.99,
            status: 'completed',
            tenantId: 2,
            createdAt: '2024-01-27T14:55:00Z',
            updatedAt: '2024-01-27T16:40:00Z',
        },
    ];

    await db.insert(orders).values(sampleOrders);
    
    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});