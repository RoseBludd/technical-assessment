import dotenv from "dotenv";
import { AppDataSource } from "../ormconfig";
import app from "./server";

dotenv.config();

const PORT = process.env.APP_PORT || 5000;

// initialize the database connection first.
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error: ", error);
  });
