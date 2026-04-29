import { integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { products } from "./product.schema.js";
import { users } from "./user.schema.js";

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),

  quantity: integer("quantity").notNull(),

  selectedSize: varchar("selected_size", { length: 10 }),

  sizePrice: numeric("size_price", { precision: 10, scale: 2 }),
});
