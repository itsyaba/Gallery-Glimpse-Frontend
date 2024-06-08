import path from "path";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import AppError from "./middleware/errorMiddleware.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "https://gallery-glimpse-web.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.static(path.join(__dirname, "public")));


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);


app.all("*", (req, res, next) => {
  next(new AppError(`Can Not Find ${req.originalUrl} On This Server!!!`, 404));
});


app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server Running in ${process.env.NODE_ENV} Mode On Port ${port}!`);
});
