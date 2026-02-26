import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Express, Request } from "express";
import { z } from "zod";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
const CONTACT_SUBMISSIONS_PATH = path.join(PROJECT_ROOT, "data", "contact-submissions.ndjson");

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(40),
  company: z.string().trim().min(2).max(160),
  employees: z.string().trim().min(1).max(32),
  message: z.string().trim().max(2000).optional(),
});

function getClientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return req.ip ?? null;
}

async function appendContactSubmission(record: unknown) {
  await fs.mkdir(path.dirname(CONTACT_SUBMISSIONS_PATH), { recursive: true });
  await fs.appendFile(CONTACT_SUBMISSIONS_PATH, `${JSON.stringify(record)}\n`, "utf-8");
}

export function registerSiteRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      service: "glx-site-server",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  app.post("/api/contact", async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid contact payload",
        issues: parsed.error.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const submission = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      employees: parsed.data.employees,
      message: parsed.data.message || "",
      meta: {
        ip: getClientIp(req),
        userAgent: req.get("user-agent") ?? null,
        origin: req.get("origin") ?? null,
        referer: req.get("referer") ?? null,
      },
    };

    try {
      await appendContactSubmission(submission);
      console.log("[contact] new submission", {
        id: submission.id,
        email: submission.email,
        company: submission.company,
      });
      res.status(201).json({ success: true, id: submission.id });
    } catch (error) {
      console.error("[contact] failed to persist submission", error);
      res.status(500).json({
        success: false,
        message: "Could not store contact submission",
      });
    }
  });
}
