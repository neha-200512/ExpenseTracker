import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createRequire } from "node:module";
import authRouter from "./routers/auth.router.js";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

// Setup PostgreSQL pool + Prisma adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });

// Make prisma available to all routes
app.locals.prisma = prisma;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRouter);

// Start server
const PORT = process.env.PORT || 7000;

async function main() {
	try {
		await prisma.$connect();
		console.log("Database connected");

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();

// Graceful shutdown
process.on("SIGTERM", async () => {
	await prisma.$disconnect();
	process.exit(0);
});
