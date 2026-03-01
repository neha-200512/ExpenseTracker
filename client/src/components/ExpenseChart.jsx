import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

// Consistent palette for pie chart slices
const CHART_COLORS = [
	"#6366f1",
	"#ef4444",
	"#f59e0b",
	"#10b981",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
	"#06b6d4",
];

export default function ExpenseChart({ expenses }) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const categoryTotals = expenses.reduce((acc, expense) => {
			const name = expense.category || "Unknown";
			acc[name] = (acc[name] || 0) + parseFloat(expense.amount);
			return acc;
		}, {});

		// Sort by total descending
		const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
		const labels = sorted.map(([name]) => name);
		const data = sorted.map(([, total]) => total);
		const colors = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

		setChartData({
			labels,
			datasets: [
				{ data, backgroundColor: colors, borderWidth: 2, borderColor: "#fff" },
			],
		});

		setChartOptions({
			plugins: {
				legend: {
					position: "bottom",
					labels: { padding: 16, usePointStyle: true, pointStyle: "circle" },
				},
				tooltip: {
					callbacks: {
						label: (ctx) => ` ${ctx.label}: ₹${ctx.parsed.toFixed(2)}`,
					},
				},
			},
			responsive: true,
			maintainAspectRatio: false,
		});
	}, [expenses]);

	const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
	const hasData = expenses.length > 0;

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">
					<i className="pi pi-chart-pie mr-2 text-indigo-500"></i>Spending by
					Category
				</h3>
				<span className="text-sm font-bold text-gray-900">
					₹{totalExpenses.toFixed(2)}
				</span>
			</div>

			{hasData ? (
				<div style={{ height: "300px" }}>
					<Chart
						type="pie"
						data={chartData}
						options={chartOptions}
						style={{ width: "100%", height: "100%" }}
					/>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
					<i className="pi pi-chart-pie text-4xl mb-3"></i>
					<p className="text-sm">No expense data to display</p>
				</div>
			)}
		</div>
	);
}
