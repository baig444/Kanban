import { db } from "../db.js";
import { carModel } from "../models/car.model.js"
import { and, eq, gte, lte,sql } from "drizzle-orm";
import { cars } from "../schema.js";

export const getCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      brand,
      minPrice,
      maxPrice,
      year,
    } = req.query;

    // -------------------------
    // 1️⃣ FILTERS ARRAY
    // -------------------------
    const filters = [];

    // 🔍 SEARCH (name OR brand)
    if (search) {
      filters.push(
        or(
          ilike(cars.name, `%${search}%`),
          ilike(cars.brand, `%${search}%`)
        )
      );
    }

    // Brand filter
    if (brand) filters.push(ilike(cars.brand, brand));

    // Year filter
    if (year) filters.push(sql`${cars.year} = ${Number(year)}`);

    // Price filter
    if (minPrice) filters.push(gte(cars.price, Number(minPrice)));
    if (maxPrice) filters.push(lte(cars.price, Number(maxPrice)));

    // -------------------------
    // 2️⃣ WHERE CLAUSE
    // -------------------------
    const whereClause = filters.length ? and(...filters) : undefined;

    // -------------------------
    // 3️⃣ PAGINATION
    // -------------------------
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // -------------------------
    // 4️⃣ MAIN QUERY
    // -------------------------
    const data = await db
      .select()
      .from(cars)
      .where(whereClause)
      .limit(limitNum)
      .offset(offset)
      .orderBy(sql`${cars.createdAt} DESC`);

    // -------------------------
    // 5️⃣ COUNT QUERY
    // -------------------------
    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(cars)
      .where(whereClause);

    const totalRecords = Number(countResult[0].count);

    // -------------------------
    // 6️⃣ RESPONSE
    // -------------------------
    res.json({
      success: true,
      data,
      pagination: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / limitNum),
        pageSize: limitNum,
      },
    });
  } catch (error) {
    console.error("getCars error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
    });
  }
};



export const addCar = async (req, res) => {
  try {
    const car = await carModel.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: "Failed to add car" });
  }
};