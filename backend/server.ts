import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// server.ts
import doorRoutes from "./routes/doorRoutes"; // NO .js and use relative path


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/doors", doorRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
