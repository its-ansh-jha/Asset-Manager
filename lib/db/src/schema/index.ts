import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";

export type SiteContentData = {
  schoolName: string;
  shortName: string;
  tagline: string;
  heroTitle: string;
  heroCopy: string;
  aboutCopy: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
  notices: unknown[];
  gallery: unknown[];
  faculty: unknown[];
  achievements: unknown[];
  facilities: unknown[];
  admissions: unknown[];
};

export const siteContentTable = pgTable("site_content", {
  id: integer("id").primaryKey(),
  data: jsonb("data").$type<SiteContentData>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SiteContentRow = typeof siteContentTable.$inferSelect;
