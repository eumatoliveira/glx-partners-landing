import { createHttpApp } from "../server/_core/app";

let appPromise: ReturnType<typeof createHttpApp> | null = null;

function getApp() {
  if (!appPromise) {
    process.env.NODE_ENV = process.env.NODE_ENV || "production";
    appPromise = createHttpApp();
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}
