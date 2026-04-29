// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/neon-http';
// import { neon } from '@neondatabase/serverless';


// if(!process.env.DATABASE_URL) throw new Error('Database url missing');


// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle(sql);


import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "ecommerce_dev",
  user: "epoit", 
  password: "",     
});

export const db = drizzle(pool);
