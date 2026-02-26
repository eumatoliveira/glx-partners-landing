CREATE TABLE `control_tower_ingestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileType` enum('pdf','csv','xlsx') NOT NULL,
	`status` enum('pending','committed','failed') NOT NULL DEFAULT 'pending',
	`parsedRows` int NOT NULL DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `control_tower_ingestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `control_tower_facts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ingestionId` int NOT NULL,
	`userId` int NOT NULL,
	`eventAt` timestamp NOT NULL,
	`channel` varchar(120) NOT NULL,
	`professional` varchar(120) NOT NULL,
	`procedureName` varchar(120) NOT NULL,
	`status` enum('agendado','realizado','cancelado','noshow') NOT NULL DEFAULT 'agendado',
	`entries` decimal(15,2) NOT NULL DEFAULT '0',
	`exits` decimal(15,2) NOT NULL DEFAULT '0',
	`revenueValue` decimal(15,2) NOT NULL DEFAULT '0',
	`slotsAvailable` int NOT NULL DEFAULT 0,
	`slotsEmpty` int NOT NULL DEFAULT 0,
	`ticketMedio` decimal(15,2) NOT NULL DEFAULT '0',
	`custoVariavel` decimal(15,2) NOT NULL DEFAULT '0',
	`durationMinutes` int NOT NULL DEFAULT 0,
	`materialList` json,
	`waitMinutes` int NOT NULL DEFAULT 0,
	`npsScore` int NOT NULL DEFAULT 0,
	`baseOldRevenueCurrent` decimal(15,2) NOT NULL DEFAULT '0',
	`baseOldRevenuePrevious` decimal(15,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `control_tower_facts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `control_tower_rca` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`alertId` varchar(64) NOT NULL,
	`severity` enum('P1','P2','P3') NOT NULL,
	`title` varchar(255) NOT NULL,
	`rootCause` text NOT NULL,
	`actionPlan` text NOT NULL,
	`owner` varchar(120) NOT NULL,
	`dueDate` timestamp NOT NULL,
	`status` enum('open','in_progress','done') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `control_tower_rca_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `control_tower_ingestions` ADD CONSTRAINT `control_tower_ingestions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `control_tower_facts` ADD CONSTRAINT `control_tower_facts_ingestionId_control_tower_ingestions_id_fk` FOREIGN KEY (`ingestionId`) REFERENCES `control_tower_ingestions`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `control_tower_facts` ADD CONSTRAINT `control_tower_facts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `control_tower_rca` ADD CONSTRAINT `control_tower_rca_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
