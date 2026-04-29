import { boolean, integer, numeric, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// export const cars = pgTable('cars', {
//   id: serial('id').primaryKey(),
//   name: varchar('name',{length: 100}).notNull(),
//   model: varchar('model', {length: 100}).notNull(),
//   brand: varchar('brand').notNull(),
//   year: numeric('year').notNull(),
//   price: numeric('price', {precision: 10, scale: 2}).notNull(),
//   createdAt: timestamp('created_at').defaultNow()
// });


export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 100 }).notNull(),

  password: varchar("password", { length: 255 }),

  isVerified: boolean("is_verified").default(false),

  otp: varchar("otp", { length: 10 }),

  otpExpiry: timestamp("otp_expiry"),

  role: varchar("role", { length: 20 }).default("customer"),

  createdAt: timestamp("created_at").defaultNow(),
});
