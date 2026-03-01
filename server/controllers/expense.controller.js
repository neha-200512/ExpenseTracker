// Get all expenses
export const getExpenses = async (req, res) => {
	try {
		const expenses = await req.app.locals.prisma.expense.findMany({
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
			orderBy: { date: "desc" },
		});
		res.json(expenses);
	} catch (error) {
		console.error("Get expenses error:", error);
		res.status(500).json({ error: "Failed to fetch expenses" });
	}
};

// Create new expense
export const createExpense = async (req, res) => {
	try {
		const { amount, description, date, userId, category } = req.body;

		const expense = await req.app.locals.prisma.expense.create({
			data: {
				amount: parseFloat(amount),
				description,
				category,
				date: new Date(date),
				userId: parseInt(userId),
			},
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		res.status(201).json(expense);
	} catch (error) {
		console.error("Create expense error:", error);
		res.status(500).json({ error: "Failed to create expense" });
	}
};

// Delete expense
export const deleteExpense = async (req, res) => {
	try {
		const expenseId = parseInt(req.params.id);

		await req.app.locals.prisma.expense.delete({
			where: { id: expenseId },
		});

		res.json({ message: "Expense deleted successfully" });
	} catch (error) {
		console.error("Delete expense error:", error);
		res.status(500).json({ error: "Failed to delete expense" });
	}
};

// Get expense by ID
export const getExpenseById = async (req, res) => {
	try {
		const expenseId = parseInt(req.params.id);

		const expense = await req.app.locals.prisma.expense.findUnique({
			where: { id: expenseId },
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		if (!expense) {
			return res.status(404).json({ error: "Expense not found" });
		}

		res.json(expense);
	} catch (error) {
		console.error("Get expense by ID error:", error);
		res.status(500).json({ error: "Failed to fetch expense" });
	}
};
