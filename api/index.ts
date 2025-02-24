import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";

export const app = express();
const port = process.env.PORT || 3001;

// Basic middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/tasks", taskRoutes);

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
