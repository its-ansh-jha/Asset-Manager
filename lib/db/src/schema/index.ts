import { customType, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});

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

export const imageUploadsTable = pgTable("image_uploads", {
  id: text("id").primaryKey(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SiteContentRow = typeof siteContentTable.$inferSelect;
