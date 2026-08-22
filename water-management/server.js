require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const { authLimiter, generalLimiter } = require("./middleware/rateLimiter");
const { startImageCleanupJob } = require("./jobs/imageCleanupJob");

const app = express();

connectDB();
startImageCleanupJob();

// Security headers
app.use(helmet());

app.use(cors());
app.use(express.json());

// Strips any keys starting with "$" or containing "." from req.body/query/params
// — prevents NoSQL injection like { "email": { "$gt": "" } }
app.use(mongoSanitize());

// General rate limit on all API routes
app.use("/api", generalLimiter);

app.get("/", (req, res) => {
  res.send("Water Management API is running");
});

// Auth routes get a stricter limiter (brute-force / fake-account protection)
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Global error handler — turns any thrown/next(err) error into clean JSON
// instead of Express's default HTML error page.
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  const message =
    err && err.message ? err.message : "Something went wrong on the server";
  res.status(err.status || 500).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));