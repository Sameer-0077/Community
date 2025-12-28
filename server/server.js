const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = require("./config/db");

connectDb();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("<h2>Hey there!</h2>");
});

app.listen(PORT, () => {
  console.log(`Server is runnig at http://localhost:${PORT}`);
});
