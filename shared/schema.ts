import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(''),
  tags: text("tags").array().notNull().default([]),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
});

export const updatePhotoSchema = createInsertSchema(photos).pick({
  title: true,
  description: true,
  tags: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type UpdatePhoto = z.infer<typeof updatePhotoSchema>;
