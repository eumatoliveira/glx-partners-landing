CREATE TABLE `andon_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`severity` enum('critical','warning','info','success') NOT NULL DEFAULT 'warning',
	`title` varchar(255) NOT NULL,
	`description` text,
	`actionLabel` varchar(100),
	`actionUrl` varchar(255),
	`isResolved` boolean NOT NULL DEFAULT false,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `andon_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ceo_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`faturamento` decimal(15,2),
	`faturamentoVariacao` decimal(5,2),
	`ebitda` decimal(15,2),
	`ebitdaVariacao` decimal(5,2),
	`npsScore` int,
	`npsVariacao` decimal(5,2),
	`ocupacao` decimal(5,2),
	`ocupacaoVariacao` decimal(5,2),
	`forecastData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ceo_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`logo` text,
	`industry` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `data_governance_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`registrosTotais` int,
	`dataQualityScore` int,
	`lgpdCompliance` int,
	`issuesPendentes` int,
	`completude` int,
	`precisao` int,
	`consistencia` int,
	`atualidade` int,
	`validade` int,
	`integracoesData` json,
	`problemasData` json,
	`criptografia` int,
	`auditTrailEvents` int,
	`backupStatus` varchar(50),
	`lastBackup` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `data_governance_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `data_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileType` enum('excel','csv','json','manual','ai') NOT NULL,
	`fileUrl` text,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`recordsImported` int,
	`errorMessage` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `data_imports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`receitaBruta` decimal(15,2),
	`impostos` decimal(15,2),
	`receitaLiquida` decimal(15,2),
	`custosPessoal` decimal(15,2),
	`custosInsumos` decimal(15,2),
	`custosOperacionais` decimal(15,2),
	`custosMarketing` decimal(15,2),
	`margemBruta` decimal(5,2),
	`margemOperacional` decimal(5,2),
	`margemLiquida` decimal(5,2),
	`saldoCaixa` decimal(15,2),
	`fluxoCaixaOperacional` decimal(15,2),
	`margemPorHoraData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketing_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`totalSpend` decimal(15,2),
	`spendVariacao` decimal(5,2),
	`costPerLead` decimal(10,2),
	`cplVariacao` decimal(5,2),
	`acquisitionCost` decimal(10,2),
	`cacVariacao` decimal(5,2),
	`marketingRoi` decimal(7,2),
	`roiVariacao` decimal(5,2),
	`funnelData` json,
	`roiForecastData` json,
	`channelPerformanceData` json,
	`bestChannel` varchar(100),
	`bestChannelRoi` decimal(5,2),
	`channelToOptimize` varchar(100),
	`optimizeReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketing_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operations_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`oeeGeral` decimal(5,2),
	`disponibilidade` decimal(5,2),
	`performance` decimal(5,2),
	`qualidade` decimal(5,2),
	`taxaOcupacao` decimal(5,2),
	`tempoMedioEspera` int,
	`atendimentosDia` int,
	`taktCycleData` json,
	`ocupacaoSalasData` json,
	`gargalosData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operations_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `people_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`headcount` int,
	`headcountVariacao` decimal(5,2),
	`turnover` decimal(5,2),
	`turnoverVariacao` decimal(5,2),
	`absenteismo` decimal(5,2),
	`absenteismoVariacao` decimal(5,2),
	`revenuePerFte` decimal(15,2),
	`revenueFteVariacao` decimal(5,2),
	`produtividadeData` json,
	`turnoverAbsenteismoData` json,
	`teamPerformanceData` json,
	`certificacoes` int,
	`horasTreinamento` int,
	`metaAtingida` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `people_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quality_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`npsScore` int,
	`npsRespostas` int,
	`promotores` decimal(5,2),
	`passivos` decimal(5,2),
	`detratores` decimal(5,2),
	`dpmo` int,
	`sigmaLevel` decimal(3,1),
	`cp` decimal(4,2),
	`cpk` decimal(4,2),
	`firstPassYield` decimal(5,2),
	`controlChartData` json,
	`feedbackData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quality_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waste_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`noShowRate` decimal(5,2),
	`noShowVariacao` decimal(5,2),
	`financialLoss` decimal(15,2),
	`idleCapacityHours` int,
	`efficiencyScore` int,
	`heatmapData` json,
	`wasteBreakdownData` json,
	`departmentImpactData` json,
	`recoveryActionsData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waste_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `andon_alerts` ADD CONSTRAINT `andon_alerts_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ceo_metrics` ADD CONSTRAINT `ceo_metrics_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `data_governance_data` ADD CONSTRAINT `data_governance_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `data_imports` ADD CONSTRAINT `data_imports_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `data_imports` ADD CONSTRAINT `data_imports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_data` ADD CONSTRAINT `financial_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marketing_data` ADD CONSTRAINT `marketing_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `operations_data` ADD CONSTRAINT `operations_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `people_data` ADD CONSTRAINT `people_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quality_data` ADD CONSTRAINT `quality_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `waste_data` ADD CONSTRAINT `waste_data_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;