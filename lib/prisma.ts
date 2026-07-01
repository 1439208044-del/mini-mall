import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function getSqliteUrl(url: string) {
  if (!url.startsWith("file:")) return url;

  const dbRelativePath = url.slice(5);
  const sourcePath = path.resolve(projectRoot, dbRelativePath);
  const targetDir = path.join("/tmp", "prisma");
  const targetPath = path.join(targetDir, path.basename(dbRelativePath));

  try {
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetDir, { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
    }
    return `file:${targetPath}`;
  } catch (error) {
    console.warn("Prisma SQLite fallback copy failed:", error);
    return url;
  }
}

const rawDatabaseUrl = process.env.DATABASE_URL ?? "";
const databaseUrl =
  process.env.NODE_ENV === "production" && rawDatabaseUrl.startsWith("file:")
    ? getSqliteUrl(rawDatabaseUrl)
    : rawDatabaseUrl;

if (databaseUrl && databaseUrl !== process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
