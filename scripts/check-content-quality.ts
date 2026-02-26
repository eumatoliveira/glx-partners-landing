import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pt } from "../client/src/i18n/pt";
import { en } from "../client/src/i18n/en";
import { es } from "../client/src/i18n/es";
import { getAdminLayoutCopy, getClientLayoutCopy } from "../client/src/lib/dashboardLocale";
import { getControlTowerLocale } from "../client/src/lib/controlTowerLocale";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const suspectTokens = [
  "Ã§",
  "Ã£",
  "Ã¡",
  "Ã©",
  "Ã³",
  "Ãª",
  "Ãº",
  "Ã­",
  "Ã±",
  "Â¿",
  "Â©",
  "â€¢",
  "â€”",
  "â€“",
  "âœ",
];
const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkFiles(full));
      continue;
    }

    if (codeExtensions.has(path.extname(entry.name))) {
      result.push(full);
    }
  }
  return result;
}

function flattenKeys(input: unknown, base = ""): string[] {
  if (input === null || input === undefined) return [];
  if (typeof input !== "object") return [base];
  if (Array.isArray(input)) {
    return input.flatMap((value, index) => flattenKeys(value, `${base}[${index}]`));
  }

  const objectInput = input as Record<string, unknown>;
  return Object.keys(objectInput).flatMap(key => {
    const nextBase = base ? `${base}.${key}` : key;
    return flattenKeys(objectInput[key], nextBase);
  });
}

function compareKeyParity(label: string, baseObj: unknown, compareObj: unknown): string[] {
  const baseKeys = new Set(flattenKeys(baseObj).filter(Boolean));
  const compareKeys = new Set(flattenKeys(compareObj).filter(Boolean));
  const missingInCompare = [...baseKeys].filter(key => !compareKeys.has(key));
  const extraInCompare = [...compareKeys].filter(key => !baseKeys.has(key));
  return [
    ...missingInCompare.map(key => `[${label}] missing key: ${key}`),
    ...extraInCompare.map(key => `[${label}] extra key: ${key}`),
  ];
}

function checkMojibake(): string[] {
  const sourceRoots = [
    path.join(rootDir, "client", "src", "pages"),
    path.join(rootDir, "client", "src", "components"),
    path.join(rootDir, "client", "src", "lib"),
  ];
  const files = sourceRoots.flatMap(walkFiles);
  const issues: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      const hit = suspectTokens.find(token => line.includes(token));
      if (!hit) return;
      const relativePath = path.relative(rootDir, file).replace(/\\/g, "/");
      issues.push(`[mojibake] ${relativePath}:${index + 1} token "${hit}"`);
    });
  }

  return issues;
}

function checkLocaleParity(): string[] {
  const issues: string[] = [];

  issues.push(...compareKeyParity("i18n en", pt, en));
  issues.push(...compareKeyParity("i18n es", pt, es));

  const clientPt = getClientLayoutCopy("pt");
  const clientEn = getClientLayoutCopy("en");
  const clientEs = getClientLayoutCopy("es");
  issues.push(...compareKeyParity("dashboardLocale client en", clientPt, clientEn));
  issues.push(...compareKeyParity("dashboardLocale client es", clientPt, clientEs));

  const adminPt = getAdminLayoutCopy("pt");
  const adminEn = getAdminLayoutCopy("en");
  const adminEs = getAdminLayoutCopy("es");
  issues.push(...compareKeyParity("dashboardLocale admin en", adminPt, adminEn));
  issues.push(...compareKeyParity("dashboardLocale admin es", adminPt, adminEs));

  const towerPt = getControlTowerLocale("pt");
  const towerEn = getControlTowerLocale("en");
  const towerEs = getControlTowerLocale("es");
  issues.push(...compareKeyParity("controlTowerLocale en", towerPt, towerEn));
  issues.push(...compareKeyParity("controlTowerLocale es", towerPt, towerEs));

  return issues;
}

function main() {
  const issues = [...checkMojibake(), ...checkLocaleParity()];
  if (issues.length === 0) {
    console.log("content-quality-check: ok");
    return;
  }

  console.error("content-quality-check: failed");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exitCode = 1;
}

main();
