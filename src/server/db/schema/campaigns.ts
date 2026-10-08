import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'

import { createdAt, id, json, updatedAt } from '#/server/db/schema/columns'
import { newsletterSubscribers } from '#/server/db/schema/content'

export const CAMPAIGN_STATUSES = ['draft', 'sending', 'sent', 'failed'] as const

// Promotional emails to newsletter subscribers; drafts are editable until sent.
export const campaigns = sqliteTable('campaigns', {
  id: id(),
  subject: text('subject').notNull(),
  preheader: text('preheader').notNull().default(''),
  body: text('body').notNull().default(''),
  ctaLabel: text('cta_label'),
  ctaUrl: text('cta_url'),
  audience: text('audience', { enum: ['all', 'selected'] })
    .notNull()
    .default('all'),
  selectedIds: json<Array<string>>('selected_ids').notNull().default([]),
  status: text('status', { enum: CAMPAIGN_STATUSES })
    .notNull()
    .default('draft'),
  recipientCount: integer('recipient_count').notNull().default(0),
  sentCount: integer('sent_count').notNull().default(0),
  failedCount: integer('failed_count').notNull().default(0),
  createdBy: text('created_by'),
  sentBy: text('sent_by'),
  sentAt: text('sent_at'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

// Snapshot of who a campaign went to, taken at send time.
export const campaignRecipients = sqliteTable(
  'campaign_recipients',
  {
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id, { onDelete: 'cascade' }),
    subscriberId: text('subscriber_id')
      .notNull()
      .references(() => newsletterSubscribers.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    status: text('status', { enum: ['queued', 'sent', 'failed'] })
      .notNull()
      .default('queued'),
    error: text('error'),
    sentAt: text('sent_at'),
  },
  (t) => [
    primaryKey({ columns: [t.campaignId, t.subscriberId] }),
    index('campaign_recipients_status_idx').on(t.campaignId, t.status),
  ],
)
