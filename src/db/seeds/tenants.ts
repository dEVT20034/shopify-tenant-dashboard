import { db } from '@/db';
import { tenants } from '@/db/schema';

async function main() {
    const sampleTenants = [
        {
            name: 'Acme Store',
            shopifyDomain: 'acme-store.myshopify.com',
            shopifyApiKey: 'demo_api_key_acme_123456',
            shopifyApiSecret: 'demo_api_secret_acme_abcdef',
            shopifyAccessToken: 'shpat_demo_token_acme_xyz789',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'TechGear Shop',
            shopifyDomain: 'techgear-shop.myshopify.com',
            shopifyApiKey: 'demo_api_key_techgear_654321',
            shopifyApiSecret: 'demo_api_secret_techgear_fedcba',
            shopifyAccessToken: 'shpat_demo_token_techgear_987zyx',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(tenants).values(sampleTenants);
    
    console.log('✅ Tenants seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});