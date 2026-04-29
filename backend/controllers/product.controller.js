import { db } from "../db.js";
import cloudinary  from "../lib/cloudinary.js";
import { eq } from "drizzle-orm";
import { products } from "../schema/product.schema.js";
import { productImages } from "../schema/images.schema.js";
// import { productSizes } from "../schema/sizes.schema.js";
// import { productImages } from "../schema/images.schema.js";

/* ============================
   ADD PRODUCT
============================ */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      saleprice,
      material,
      color,
      stock,
      care,
      disclaimer,
      sizes,
      images,
    } = req.body;


    // 2️⃣ insert product
    const [product] = await db
      .insert(products)
      .values({
        name,
        description,
        category,
        price,
        salePrice: saleprice,
        material,
        color,
        stock,
        care,
        sizes,
        disclaimer,
      })
      .returning();
 

      let uploadedImages = []

      if (images && images.length > 0) {
      const uploads = await Promise.all(
        images.map((img) =>
          cloudinary.uploader.upload(img.preview || img, {
            folder: "laddu_products",
          })
        )
      );

      const imageRows = uploads.map((u) => ({
        productId: product.id,
        url: u.secure_url,
        publicId: u.public_id,
      }));

     uploadedImages = await db.insert(productImages).values(imageRows).returning();
    }

    // 3️⃣ insert sizes
    // if (Array.isArray(sizes)) {
    //   for (const s of sizes) {
    //     await db.insert(productSizes).values({
    //       productId: product.id,
    //       size: s.size,
    //       price: s.price,
    //     });
    //   }
    // }

    // // 4️⃣ insert images
    // for (const url of imageUrls) {
    //   await db.insert(productImages).values({
    //     productId: product.id,
    //     url,
    //   });
    // }

    res.status(201).json({
      message: "Product added successfully",
      product,
      productId: product.id,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   GET ALL PRODUCTS
============================ */

export const getProducts = async (req, res) => {
  try {
    const allProducts = await db.select().from(products);

    const result = [];

    for (const product of allProducts) {
      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      result.push({
        ...product,
        images,
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ============================
   GET PRODUCT BY ID
============================ */
export const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sizes = await db
      .select()
      .from(productSizes)
      .where(eq(productSizes.productId, productId));

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId));

    res.json({
      ...product[0],
      sizes,
      images,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   DELETE PRODUCT
============================ */
export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(products).where(eq(products.id, id));

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
