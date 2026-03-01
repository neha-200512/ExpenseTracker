import { Router } from "express";
import {
	getExpenses,
	createExpense,
	deleteExpense,
	getExpenseById,
} from "../controllers/expense.controller.js";

const router = Router();

// GET /expenses - Get all expenses
router.get("/", getExpenses);

// POST /expenses - Create new expense
router.post("/", createExpense);

// GET /expenses/:id - Get expense by ID
router.get("/:id", getExpenseById);

// DELETE /expenses/:id - Delete expense
router.delete("/:id", deleteExpense);

export default router;
