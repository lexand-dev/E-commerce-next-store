import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const stores = pgTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const storeRelations = relations(stores, ({ many }) => ({
  billboard: many(billboard),
}));

export const billboard = pgTable("billboard", {
  id: text("id"),
  storeId: text("storeId").references(() => stores.id),
  label: text("label"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const billboardRelations = relations(billboard, ({ one }) => ({
  store: one(stores, {
    fields: [billboard.storeId],
    references: [stores.id],
  }),
}));
