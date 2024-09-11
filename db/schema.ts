import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const stores = pgTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
});

export const insertStoreSchema = createInsertSchema(stores);
