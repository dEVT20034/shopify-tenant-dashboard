CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shopify_customer_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`total_spent` real DEFAULT 0 NOT NULL,
	`tenant_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `customers_tenant_id_idx` ON `customers` (`tenant_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_tenant_shopify_customer_idx` ON `customers` (`tenant_id`,`shopify_customer_id`);--> statement-breakpoint
CREATE INDEX `customers_tenant_id_composite_idx` ON `customers` (`tenant_id`,`id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shopify_order_id` text NOT NULL,
	`customer_id` integer,
	`total_price` real DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`tenant_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `orders_tenant_id_idx` ON `orders` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `orders_customer_id_idx` ON `orders` (`customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_tenant_shopify_order_idx` ON `orders` (`tenant_id`,`shopify_order_id`);--> statement-breakpoint
CREATE INDEX `orders_tenant_id_composite_idx` ON `orders` (`tenant_id`,`id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shopify_product_id` text NOT NULL,
	`title` text NOT NULL,
	`price` real DEFAULT 0 NOT NULL,
	`inventory` integer DEFAULT 0 NOT NULL,
	`tenant_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `products_tenant_id_idx` ON `products` (`tenant_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_tenant_shopify_product_idx` ON `products` (`tenant_id`,`shopify_product_id`);--> statement-breakpoint
CREATE INDEX `products_tenant_id_composite_idx` ON `products` (`tenant_id`,`id`);--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`shopify_domain` text NOT NULL,
	`shopify_api_key` text NOT NULL,
	`shopify_api_secret` text NOT NULL,
	`shopify_access_token` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_shopify_domain_unique` ON `tenants` (`shopify_domain`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_shopify_domain_idx` ON `tenants` (`shopify_domain`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`tenant_id` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_tenant_id_idx` ON `users` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `users_tenant_id_email_idx` ON `users` (`tenant_id`,`id`);