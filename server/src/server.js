import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `ZABWelfare API running on http://localhost:${PORT}`
      );
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);

      server.close(async () => {
        try {
          const mongoose = await import("mongoose");
          await mongoose.default.connection.close();

          console.log("Server and database connection closed.");
          process.exit(0);
        } catch (error) {
          console.error("Shutdown error:", error.message);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();