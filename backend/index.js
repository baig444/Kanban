import express from "express";
import dotenv from "dotenv";
import productRoutes from './routes/product.routes.js'
dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes)


app.get("/", (req, res) => {
  res.send("Welcome to Dubx Car Rentals");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
