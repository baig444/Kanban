import { integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { products } from "./product.schema.js";

export const productSizes = pgTable("product_sizes", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),

  size: varchar("size", { length: 10 }).notNull(),

  price: numeric("price", { precision: 10, scale: 2 }),
});
