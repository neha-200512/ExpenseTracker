import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authRouter from "./routers/auth.router.js";
import expenseRouter from "./routers/expense.router.js";

// Setup Prisma with PG adapter (Prisma 7)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const app = express();
const prisma = new PrismaClient({ adapter });

// Make prisma available to all routes
app.locals.prisma = prisma;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/expenses", expenseRouter);

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
