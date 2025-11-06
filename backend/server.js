import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import testRoute from "./routes/testRoute.js";
import productRoutes from "./routes/productRoutes.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors(process.env.FRONTEND_URL));
app.use(express.json());

// Routes
app.use("/api/test", testRoute);
app.use("/api/products",productRoutes);

// DB connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
