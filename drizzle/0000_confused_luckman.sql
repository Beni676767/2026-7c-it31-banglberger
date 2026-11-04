CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'Allgemein' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
