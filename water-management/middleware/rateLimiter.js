const rateLimit = require("express-rate-limit");

// Strict limiter for login/register — blocks brute-force password guessing
// and mass fake-account creation. 10 attempts per 15 minutes per IP.
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Looser limiter for general API usage — guards against abusive scripts
// without getting in the way of normal use. 200 requests per 15 minutes per IP.
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});