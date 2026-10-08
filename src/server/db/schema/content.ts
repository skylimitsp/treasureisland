import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import {
  bool,
  createdAt,
  id,
  json,
  updatedAt,
} from '#/server/db/schema/columns'
import type { MenuCategory } from '#/types'

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id: id(),
  email: text('email').notNull().unique(),
  source: text('source', {
    enum: ['footer', 'home', 'about', 'events'],
  }).notNull(),
  status: text('status', {
    enum: ['pending', 'subscribed', 'unsubscribed'],
  }).notNull(),
  confirmToken: text('confirm_token'),
  unsubscribeToken: text('unsubscribe_token').notNull(),
  confirmedAt: text('confirmed_at'),
  createdAt: createdAt(),
})

// One table backs both moderation (reviews) and the public testimonials (featured).
export const reviews = sqliteTable('reviews', {
  id: id(),
  quote: text('quote').notNull(),
  name: text('name').notNull(),
  origin: text('origin').notNull(),
  rating: integer('rating'),
  featured: bool('featured').notNull().default(false),
  sort: integer('sort').notNull().default(0),
  createdAt: createdAt(),
})

export const faqs = sqliteTable('faqs', {
  id: id(),
  q: text('q').notNull(),
  a: text('a').notNull(),
  sort: integer('sort').notNull().default(0),
})

// Keyed JSON documents (e.g. `about`) edited from the admin CMS.
export const contentBlocks = sqliteTable('content_blocks', {
  key: text('key').primaryKey(),
  value: json<unknown>('value').notNull(),
  updatedBy: text('updated_by'),
  updatedAt: updatedAt(),
})

export const menuSections = sqliteTable('menu_sections', {
  id: text('id').$type<MenuCategory>().primaryKey(),
  title: text('title').notNull(),
  group: text('group', { enum: ['food', 'drinks'] }).notNull(),
  order: integer('order').notNull(),
  tagline: text('tagline'),
})

export const menuItems = sqliteTable('menu_items', {
  id: id(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category')
    .$type<MenuCategory>()
    .notNull()
    .references(() => menuSections.id),
  price: integer('price').notNull(),
  available: bool('available').notNull().default(true),
  sort: integer('sort').notNull().default(0),
})

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: json<unknown>('value').notNull(),
  updatedAt: updatedAt(),
})
