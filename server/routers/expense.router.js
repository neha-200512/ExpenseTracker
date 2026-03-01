import { Router } from "express";
import {
	getExpenses,
	createExpense,
	deleteExpense,
	getExpenseById,
} from "../controllers/expense.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

// All expense routes require authentication
router.use(auth);

// GET /expenses - Get user's expenses
router.get("/", getExpenses);

// POST /expenses - Create new expense
router.post("/", createExpense);

// GET /expenses/:id - Get expense by ID
router.get("/:id", getExpenseById);

// DELETE /expenses/:id - Delete expense
router.delete("/:id", deleteExpense);

export default router;
