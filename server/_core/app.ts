import "dotenv/config";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerSiteRoutes } from "../siteRouter";
import { serveStatic, setupVite } from "./vite";
import { registerKommoWebhookRouter } from "../infrastructure/webhooks/kommoRouter";

// ═══════════════════════════════════════════════════════════════
// Port Discovery
// ═══════════════════════════════════════════════════════════════

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.listen(port, () => {
      probe.close(() => resolve(true));
    });
    probe.on("error", () => resolve(false));
  });
}

export async function findAvailablePort(startPort: number = 3000): Promise<number> {
  const MAX_ATTEMPTS = 20;
  for (let port = startPort; port < startPort + MAX_ATTEMPTS; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + MAX_ATTEMPTS}`);
}

// ═══════════════════════════════════════════════════════════════
// In-memory Rate Limiter (no external dependency)
// Protects login, registration, and contact form endpoints
// ═══════════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

function createRateLimiter(opts: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${opts.keyPrefix}:${ip}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + opts.windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    // Set standard rate-limit headers
    res.setHeader("X-RateLimit-Limit", opts.maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, opts.maxRequests - entry.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

    if (entry.count > opts.maxRequests) {
      res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfterMs: entry.resetAt - now,
      });
      return;
    }

    next();
  };
}

// ═══════════════════════════════════════════════════════════════
// Security Headers Middleware
// ═══════════════════════════════════════════════════════════════

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0"); // Modern browsers use CSP instead
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Strict CSP only in production; dev uses eval for HMR
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://calendly.com; frame-ancestors 'none';"
    );
  }

  next();
}

// ═══════════════════════════════════════════════════════════════
// Application Setup
// ═══════════════════════════════════════════════════════════════

function registerAppRoutes(app: Express) {
  // Security headers on every response
  app.use(securityHeaders);

  // Body parsing with sensible limits (5MB default, not 50MB)
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));

  // Rate limiters for sensitive endpoints
  const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,           // 10 attempts per window
    keyPrefix: "auth",
  });
  const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 120,          // 120 req/min
    keyPrefix: "api",
  });
  const contactLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
    keyPrefix: "contact",
  });

  // Apply rate limiters to sensitive paths
  app.use("/api/trpc/emailAuth.login", authLimiter);
  app.use("/api/trpc/emailAuth.register", authLimiter);
  app.use("/api/contact", contactLimiter);
  app.use("/api/trpc", apiLimiter);

  registerSiteRoutes(app);
  registerOAuthRoutes(app);
  registerKommoWebhookRouter(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
}

export async function createHttpApp(): Promise<Express> {
  const app = express();
  registerAppRoutes(app);
  serveStatic(app);
  return app;
}

export async function startServer() {
  const app = express();
  const server = createServer(app);

  registerAppRoutes(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`[Server] Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}/`);
  });
}
