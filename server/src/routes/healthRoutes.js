import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "ZABWelfare API and database are healthy."
      : "Database connection is unavailable.",
    data: {
      api: "running",
      database: databaseConnected ? "connected" : "disconnected",
      databaseName: mongoose.connection.name || null,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;