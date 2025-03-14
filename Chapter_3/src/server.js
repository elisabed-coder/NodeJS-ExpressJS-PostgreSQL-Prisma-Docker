import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4002;

//GET the file path from the url of the current module
const __filename = fileURLToPath(import.meta.url);

//GEt the directory name from the file path
const __dirname = dirname(__filename);

//MIIDLEWARE
app.use(express.json());

//serves the HTML file from from the /public directory
//Tells express to serve all files form the public folder as static assets
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server has started:${PORT}`);
});
