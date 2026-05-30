import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env if available (for local CLI usage)
const fs = await import("node:fs");
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const { config } = await import("dotenv");
  config({ path: envPath });
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
