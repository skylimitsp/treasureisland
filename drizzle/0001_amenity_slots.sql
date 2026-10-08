CREATE TABLE `amenity_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`amenity_id` text NOT NULL,
	`label` text NOT NULL,
	`capacity` integer NOT NULL,
	`days_of_week` text,
	`active` integer DEFAULT true NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `amenity_slots_amenity_idx` ON `amenity_slots` (`amenity_id`);