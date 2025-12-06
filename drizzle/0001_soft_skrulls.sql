ALTER TABLE `customers` ADD `first_name` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `last_name` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `orders_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `order_number` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `customer_email` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `financial_status` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `order_created_at` text NOT NULL;