// Get expenses for the logged-in user
export const getExpenses = async (req, res) => {
	try {
		const expenses = await req.app.locals.prisma.expense.findMany({
			where: { userId: req.user.id },
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

// Create new expense for the logged-in user
export const createExpense = async (req, res) => {
	try {
		const { amount, description, date, category } = req.body;

		const expense = await req.app.locals.prisma.expense.create({
			data: {
				amount: parseFloat(amount),
				description,
				category,
				date: new Date(date),
				userId: req.user.id,
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

// Delete expense (only if it belongs to the logged-in user)
export const deleteExpense = async (req, res) => {
	try {
		const expenseId = parseInt(req.params.id);

		// Verify the expense belongs to the user
		const expense = await req.app.locals.prisma.expense.findFirst({
			where: { id: expenseId, userId: req.user.id },
		});

		if (!expense) {
			return res.status(404).json({ error: "Expense not found" });
		}

		await req.app.locals.prisma.expense.delete({
			where: { id: expenseId },
		});

		res.json({ message: "Expense deleted successfully" });
	} catch (error) {
		console.error("Delete expense error:", error);
		res.status(500).json({ error: "Failed to delete expense" });
	}
};

// Get expense by ID (only if it belongs to the logged-in user)
export const getExpenseById = async (req, res) => {
	try {
		const expenseId = parseInt(req.params.id);

		const expense = await req.app.locals.prisma.expense.findFirst({
			where: { id: expenseId, userId: req.user.id },
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
