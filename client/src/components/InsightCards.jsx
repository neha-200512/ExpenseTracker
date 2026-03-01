// Summary stats cards for the expense dashboard

export default function InsightCards({ expenses }) {
	const totalExpenses = expenses.reduce(
		(sum, e) => sum + parseFloat(e.amount),
		0,
	);
	const expenseCount = expenses.length;
	const avgExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

	// Highest spending category
	const categoryTotals = expenses.reduce((acc, expense) => {
		const name = expense.category || "Unknown";
		acc[name] = (acc[name] || 0) + parseFloat(expense.amount);
		return acc;
	}, {});

	const topCategory = Object.entries(categoryTotals).reduce(
		(max, [category, total]) => (total > max.total ? { category, total } : max),
		{ category: "—", total: 0 },
	);

	const cards = [
		{
			label: "Total Spent",
			value: `₹${totalExpenses.toFixed(2)}`,
			icon: "pi-wallet",
			color: "indigo",
		},
		{
			label: "Transactions",
			value: expenseCount,
			icon: "pi-receipt",
			color: "blue",
		},
		{
			label: "Avg. per Transaction",
			value: `₹${avgExpense.toFixed(2)}`,
			icon: "pi-chart-bar",
			color: "emerald",
		},
		{
			label: "Top Category",
			value: topCategory.category,
			sub: topCategory.total > 0 ? `₹${topCategory.total.toFixed(2)}` : null,
			icon: "pi-tag",
			color: "amber",
		},
	];

	const colorMap = {
		indigo: {
			bg: "bg-indigo-50",
			iconBg: "bg-indigo-100",
			iconText: "text-indigo-600",
			border: "border-indigo-200",
		},
		blue: {
			bg: "bg-blue-50",
			iconBg: "bg-blue-100",
			iconText: "text-blue-600",
			border: "border-blue-200",
		},
		emerald: {
			bg: "bg-emerald-50",
			iconBg: "bg-emerald-100",
			iconText: "text-emerald-600",
			border: "border-emerald-200",
		},
		amber: {
			bg: "bg-amber-50",
			iconBg: "bg-amber-100",
			iconText: "text-amber-600",
			border: "border-amber-200",
		},
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card) => {
				const c = colorMap[card.color];
				return (
					<div
						key={card.label}
						className={`${c.bg} ${c.border} border rounded-xl p-5 flex items-start gap-4`}
					>
						<div
							className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}
						>
							<i className={`pi ${card.icon} ${c.iconText} text-lg`}></i>
						</div>
						<div className="min-w-0">
							<p className="text-sm text-gray-500 mb-1">{card.label}</p>
							<p className="text-xl font-bold text-gray-900 truncate">
								{card.value}
							</p>
							{card.sub && (
								<p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
