CREATE TABLE `auth_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`email` text NOT NULL,
	`role` text,
	`user_id` text,
	`created_by` text,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`user_agent` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`avatar` text,
	`password_hash` text,
	`active` integer DEFAULT true NOT NULL,
	`last_login_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `booking_events` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`from_status` text,
	`to_status` text,
	`note` text DEFAULT '' NOT NULL,
	`by_user` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`room_slug` text NOT NULL,
	`room_name` text NOT NULL,
	`guest_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`guests` integer NOT NULL,
	`nights` integer NOT NULL,
	`subtotal` integer NOT NULL,
	`taxes` integer DEFAULT 0 NOT NULL,
	`total` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`source` text DEFAULT 'web' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bookings_room_dates_idx` ON `bookings` (`room_id`,`check_in`,`check_out`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE TABLE `room_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_by` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `room_blocks_room_idx` ON `room_blocks` (`room_id`,`from`,`to`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`price_per_night` integer NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`max_guests` integer NOT NULL,
	`beds` text,
	`view` text,
	`bathroom` text NOT NULL,
	`amenities` text NOT NULL,
	`image` text NOT NULL,
	`inventory` integer DEFAULT 1 NOT NULL,
	`open` integer DEFAULT true NOT NULL,
	`blocked_note` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_slug_unique` ON `rooms` (`slug`);--> statement-breakpoint
CREATE TABLE `amenities` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`blurb` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`image_alt` text,
	`hero` text NOT NULL,
	`gallery` text NOT NULL,
	`highlights` text,
	`icon` text NOT NULL,
	`hours` text,
	`location` text,
	`capacity` text,
	`price` text,
	`price_note` text,
	`bookable` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `amenities_slug_unique` ON `amenities` (`slug`);--> statement-breakpoint
CREATE TABLE `enquiry_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`enquiry_id` text NOT NULL,
	`body` text NOT NULL,
	`by_user` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`enquiry_id`) REFERENCES `event_enquiries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`date` text NOT NULL,
	`flexible_dates` integer NOT NULL,
	`guests` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`budget` text,
	`message` text NOT NULL,
	`consent` integer NOT NULL,
	`status` text NOT NULL,
	`assigned_to` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `event_enquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `event_teasers` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`blurb` text NOT NULL,
	`image` text NOT NULL,
	`video` text,
	`tag` text NOT NULL,
	`kicker` text NOT NULL,
	`cta` text NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_types` (
	`slug` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`blurb` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`inclusions` text,
	`capacity_min` integer,
	`capacity_max` integer,
	`from_price` integer,
	`gallery` text NOT NULL,
	`packages` text,
	`sort` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slot_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`amenity_id` text NOT NULL,
	`slug` text NOT NULL,
	`amenity_name` text NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`party_size` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`note` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `slot_requests_amenity_idx` ON `slot_requests` (`amenity_id`,`date`);--> statement-breakpoint
CREATE TABLE `content_blocks` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_by` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`q` text NOT NULL,
	`a` text NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`available` integer DEFAULT true NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category`) REFERENCES `menu_sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `menu_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`group` text NOT NULL,
	`order` integer NOT NULL,
	`tagline` text
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`confirm_token` text,
	`unsubscribe_token` text NOT NULL,
	`confirmed_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`quote` text NOT NULL,
	`name` text NOT NULL,
	`origin` text NOT NULL,
	`rating` integer,
	`featured` integer DEFAULT false NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text,
	`diff` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `audit_log` (`entity`,`entity_id`);--> statement-breakpoint
CREATE TABLE `counters` (
	`key` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `idempotency_keys` (
	`key` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`status` integer NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`uploaded_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);