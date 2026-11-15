const errorMiddleware = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  console.error("API Error:", {
    message: err.message,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected server error occurred."
        : err.message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;