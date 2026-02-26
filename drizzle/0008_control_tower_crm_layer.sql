ALTER TABLE `control_tower_ingestions`
MODIFY COLUMN `fileType` enum('pdf','csv','xlsx','api','webhook','manual','crm') NOT NULL;
--> statement-breakpoint
ALTER TABLE `control_tower_facts`
ADD COLUMN `pipeline` varchar(120),
ADD COLUMN `unit` varchar(120),
ADD COLUMN `crmLeadId` varchar(120),
ADD COLUMN `sourceType` enum('upload','crm','api','webhook','manual') NOT NULL DEFAULT 'upload';
--> statement-breakpoint
CREATE TABLE `control_tower_crm_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('kommo') NOT NULL DEFAULT 'kommo',
	`accountDomain` varchar(255) NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`scope` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `control_tower_crm_credentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `control_tower_crm_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('kommo') NOT NULL DEFAULT 'kommo',
	`externalLeadId` varchar(120) NOT NULL,
	`pipeline` varchar(120),
	`status` varchar(120),
	`channel` varchar(120),
	`responsible` varchar(120),
	`procedureName` varchar(120),
	`valueAmount` decimal(15,2) NOT NULL DEFAULT '0',
	`createdAtCrm` timestamp NOT NULL,
	`updatedAtCrm` timestamp,
	`rawPayload` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `control_tower_crm_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `control_tower_webhook_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`provider` enum('kommo') NOT NULL DEFAULT 'kommo',
	`eventId` varchar(160) NOT NULL,
	`signature` varchar(255),
	`payload` json NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	`status` enum('accepted','processed','ignored','failed') NOT NULL DEFAULT 'accepted',
	CONSTRAINT `control_tower_webhook_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `control_tower_sync_state` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('kommo') NOT NULL DEFAULT 'kommo',
	`lastCursor` text,
	`lastSuccessAt` timestamp,
	`lastErrorAt` timestamp,
	`lastErrorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `control_tower_sync_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ct_crm_credentials_user_provider_uq` ON `control_tower_crm_credentials` (`userId`,`provider`);
--> statement-breakpoint
CREATE UNIQUE INDEX `ct_crm_leads_user_provider_external_uq` ON `control_tower_crm_leads` (`userId`,`provider`,`externalLeadId`);
--> statement-breakpoint
CREATE UNIQUE INDEX `ct_webhook_provider_event_uq` ON `control_tower_webhook_events` (`provider`,`eventId`);
--> statement-breakpoint
CREATE UNIQUE INDEX `ct_sync_state_user_provider_uq` ON `control_tower_sync_state` (`userId`,`provider`);
--> statement-breakpoint
ALTER TABLE `control_tower_crm_credentials` ADD CONSTRAINT `control_tower_crm_credentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `control_tower_crm_leads` ADD CONSTRAINT `control_tower_crm_leads_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `control_tower_webhook_events` ADD CONSTRAINT `control_tower_webhook_events_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `control_tower_sync_state` ADD CONSTRAINT `control_tower_sync_state_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
