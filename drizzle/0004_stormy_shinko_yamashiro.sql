CREATE TABLE `integrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('google_sheets','gtm','meta_pixel','meta_capi','google_ads','google_ads_enhanced','excel_graph_api','power_bi','crm_hubspot','crm_rd_station','server_side_gtm') NOT NULL,
	`name` varchar(255) NOT NULL,
	`token` text,
	`apiUrl` text,
	`config` json,
	`status` enum('active','inactive','error','pending') NOT NULL DEFAULT 'pending',
	`lastSyncAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `integrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `integrations` ADD CONSTRAINT `integrations_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `integrations` ADD CONSTRAINT `integrations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;