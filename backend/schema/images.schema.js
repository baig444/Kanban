import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { products } from "./product.schema.js";

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
});
