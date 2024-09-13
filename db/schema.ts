import { relations } from "drizzle-orm";
import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const stores = pgTable("stores", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: date("createdAt").defaultNow().notNull(),
  updatedAt: date("updatedAt").defaultNow().notNull(),
});

export const storeRelations = relations(stores, ({ many }) => ({
  billboard: many(billboard),
}));

export const billboard = pgTable("billboard", {
  id: text("id").primaryKey().notNull(),
  storeId: text("storeId").references(() => stores.id),
  label: text("label").notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: date("createdAt").defaultNow().notNull(),
  updatedAt: date("updatedAt").defaultNow().notNull(),
});

export const billboardRelations = relations(billboard, ({ one }) => ({
  store: one(stores, {
    fields: [billboard.storeId],
    references: [stores.id],
  }),
}));
