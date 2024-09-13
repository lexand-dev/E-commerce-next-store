import { relations } from "drizzle-orm";
import {
  char,
  date,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const stores = pgTable("stores", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: date("createdAt").defaultNow().notNull(),
  updatedAt: date("updatedAt").defaultNow().notNull(),
});

export const storeRelations = relations(stores, ({ many }) => ({
  billboard: many(billboard),
  categories: many(category),
}));

export const billboard = pgTable("billboard", {
  id: text("id").primaryKey().notNull(),
  storeId: text("storeId").references(() => stores.id),
  label: text("label").notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: date("createdAt").defaultNow().notNull(),
  updatedAt: date("updatedAt").defaultNow().notNull(),
});

export const billboardRelations = relations(billboard, ({ one, many }) => ({
  store: one(stores, {
    fields: [billboard.storeId],
    references: [stores.id],
  }),
  categories: many(category),
}));

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey().notNull(),
    storeId: text("storeId").references(() => stores.id),
    billboardId: text("billboardId")
      .references(() => billboard.id)
      .notNull(),
    name: text("name").notNull(),
    createdAt: date("created_at").defaultNow().notNull(),
    updatedAt: date("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    storeIdIdx: index("store_id_idx").on(table.storeId),
    billboardIdIdx: index("billboard_id_idx").on(table.billboardId),
  })
);

export const categoryRelations = relations(category, ({ one }) => ({
  store: one(stores, {
    fields: [category.storeId],
    references: [stores.id],
  }),
  billboard: one(billboard, {
    fields: [category.billboardId],
    references: [billboard.id],
  }),
}));

export const size = pgTable(
  "size",
  {
    id: text("id").primaryKey().notNull(),
    storeId: text("storeId")
      .notNull()
      .references(() => stores.id),
    name: text("name").notNull(),
    value: text("value").notNull(),
    createdAt: date("createdAt").defaultNow().notNull(),
    updatedAt: date("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    storeIdIdx: index("storeId_idx").on(table.storeId),
  })
);

export const sizeRelations = relations(size, ({ one }) => ({
  store: one(stores, {
    fields: [size.storeId],
    references: [stores.id],
  }),
}));
