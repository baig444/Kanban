import { boolean, integer, jsonb, numeric, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 200 }).notNull(),

  description: text("description"),

  category: varchar("category", { length: 100 }),

  price: numeric("price", { precision: 10, scale: 2 }),

  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),

  material: varchar("material", { length: 100 }),

  color: varchar("color", { length: 50 }),

  care: text("care"),

  disclaimer: text("disclaimer"),

  stock: integer("stock").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  sizes: jsonb("sizes").array()
});
