CREATE TABLE `manual_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` enum('financial','attendance') NOT NULL,
	`entryType` varchar(100) NOT NULL,
	`label` varchar(255) NOT NULL,
	`value` decimal(15,2),
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `manual_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `manual_entries` ADD CONSTRAINT `manual_entries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;