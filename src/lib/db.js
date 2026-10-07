import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Fallback prevents "Invalid URL" crash during Vercel's build
const connectionString =
  process.env.DATABASE_URL || "mysql://dummy:dummy@localhost:3306/dummy";
const dbUrl = new URL(connectionString);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  connectionLimit: 5,        // keep low for serverless
  connectTimeout: 10000,
  ssl:
    process.env.DB_SSL === "false"
      ? undefined
      : { rejectUnauthorized: false }, // RDS
});

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}