import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'node ./prisma/seed.js',
  },
  // Required for `npx prisma db push`
  datasource: {
    url: process.env["DATABASE_URL"],
  },
  // Required if you use `npx prisma migrate dev` later
  migrate: {
    databaseUrl: process.env["DATABASE_URL"],
  },
});