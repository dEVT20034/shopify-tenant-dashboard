import { sqliteTable, integer, text, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Tenant table - Multi-tenant root
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  shopifyDomain: text('shopify_domain').notNull().unique(),
  shopifyApiKey: text('shopify_api_key').notNull(),
  shopifyApiSecret: text('shopify_api_secret').notNull(),
  shopifyAccessToken: text('shopify_access_token'),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  shopifyDomainIdx: uniqueIndex('tenants_shopify_domain_idx').on(table.shopifyDomain),
}));

// User table - Admin users per tenant
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  tenantIdIdx: index('users_tenant_id_idx').on(table.tenantId),
  tenantIdEmailIdx: index('users_tenant_id_email_idx').on(table.tenantId, table.id),
}));

// Product table - Shopify products per tenant
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shopifyProductId: text('shopify_product_id').notNull(),
  title: text('title').notNull(),
  price: real('price').notNull().default(0),
  inventory: integer('inventory').notNull().default(0),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  tenantIdIdx: index('products_tenant_id_idx').on(table.tenantId),
  tenantProductIdx: uniqueIndex('products_tenant_shopify_product_idx').on(table.tenantId, table.shopifyProductId),
  tenantIdCompositeIdx: index('products_tenant_id_composite_idx').on(table.tenantId, table.id),
}));

// Customer table - Shopify customers per tenant
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shopifyCustomerId: text('shopify_customer_id').notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  totalSpent: real('total_spent').notNull().default(0),
  ordersCount: integer('orders_count').notNull().default(0),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  tenantIdIdx: index('customers_tenant_id_idx').on(table.tenantId),
  tenantCustomerIdx: uniqueIndex('customers_tenant_shopify_customer_idx').on(table.tenantId, table.shopifyCustomerId),
  tenantIdCompositeIdx: index('customers_tenant_id_composite_idx').on(table.tenantId, table.id),
}));

// Order table - Shopify orders per tenant
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shopifyOrderId: text('shopify_order_id').notNull(),
  orderNumber: text('order_number'),
  customerId: integer('customer_id').references(() => customers.id),
  customerEmail: text('customer_email'),
  totalPrice: real('total_price').notNull().default(0),
  status: text('status').notNull(),
  financialStatus: text('financial_status'),
  orderCreatedAt: text('order_created_at').notNull(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  tenantIdIdx: index('orders_tenant_id_idx').on(table.tenantId),
  customerIdIdx: index('orders_customer_id_idx').on(table.customerId),
  tenantOrderIdx: uniqueIndex('orders_tenant_shopify_order_idx').on(table.tenantId, table.shopifyOrderId),
  tenantIdCompositeIdx: index('orders_tenant_id_composite_idx').on(table.tenantId, table.id),
}));