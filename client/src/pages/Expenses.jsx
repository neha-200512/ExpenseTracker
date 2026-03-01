import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { addLocale } from "primereact/api";
import AddExpenseDialog from "../components/AddExpenseDialog";
import ExpenseChart from "../components/ExpenseChart";
import InsightCards from "../components/InsightCards";
import { UserIcon } from "lucide-react";

// Category tag colors for visual distinction
const CATEGORY_COLORS = {
	"Food & Dining": { bg: "bg-red-100", text: "text-red-700" },
	Transportation: { bg: "bg-blue-100", text: "text-blue-700" },
	Entertainment: { bg: "bg-purple-100", text: "text-purple-700" },
	"Bills & Utilities": { bg: "bg-amber-100", text: "text-amber-700" },
	Healthcare: { bg: "bg-emerald-100", text: "text-emerald-700" },
	Shopping: { bg: "bg-cyan-100", text: "text-cyan-700" },
	Education: { bg: "bg-indigo-100", text: "text-indigo-700" },
	Travel: { bg: "bg-pink-100", text: "text-pink-700" },
};

const DEFAULT_COLOR = { bg: "bg-gray-100", text: "text-gray-700" };

const DEFAULT_CATEGORIES = [
	"Food & Dining",
	"Transportation",
	"Entertainment",
	"Bills & Utilities",
	"Healthcare",
	"Shopping",
	"Education",
	"Travel",
	"Rent & Housing",
	"Other",
];

export default function Expenses() {
	const [expenses, setExpenses] = useState([]);
	const [filteredExpenses, setFilteredExpenses] = useState([]);
	const [selectedMonth, setSelectedMonth] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [expenseDialog, setExpenseDialog] = useState(false);
	const toast = useRef(null);
	const navigate = useNavigate();

	const token = localStorage.getItem("token");
	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/");
	};

	addLocale("custom", {
		today: "Current Month",
		clear: "Reset",
	});

	useEffect(() => {
		loadExpenses();
	}, []);

	useEffect(() => {
		filterExpenses();
	}, [expenses, selectedMonth, selectedCategory]);

	const loadExpenses = async () => {
		try {
			const response = await fetch("/api/expenses", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.status === 401) {
				handleLogout();
				return;
			}
			const data = await response.json();
			setExpenses(Array.isArray(data) ? data : []);
		} catch (error) {
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to load expenses",
			});
		} finally {
			setLoading(false);
		}
	};

	const filterExpenses = () => {
		let filtered = [...expenses];

		if (selectedMonth) {
			filtered = filtered.filter((expense) => {
				const d = new Date(expense.date);
				return (
					d.getMonth() === selectedMonth.getMonth() &&
					d.getFullYear() === selectedMonth.getFullYear()
				);
			});
		}

		if (selectedCategory) {
			filtered = filtered.filter((e) => e.category === selectedCategory);
		}

		setFilteredExpenses(filtered);
	};

	const deleteExpense = (expense) => {
		confirmDialog({
			message: "Are you sure you want to delete this expense?",
			header: "Confirm Delete",
			icon: "pi pi-exclamation-triangle",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					const res = await fetch(`/api/expenses/${expense.id}`, {
						method: "DELETE",
						headers: { Authorization: `Bearer ${token}` },
					});
					if (res.ok) {
						toast.current.show({
							severity: "success",
							summary: "Deleted",
							detail: "Expense removed",
						});
						loadExpenses();
					}
				} catch {
					toast.current.show({
						severity: "error",
						summary: "Error",
						detail: "Failed to delete",
					});
				}
			},
		});
	};

	const clearFilters = () => {
		setSelectedMonth(null);
		setSelectedCategory(null);
	};

	const totalAmount = filteredExpenses.reduce(
		(s, e) => s + parseFloat(e.amount),
		0,
	);

	// Column templates
	const amountTemplate = (row) => (
		<span className="font-semibold text-gray-900">
			₹{parseFloat(row.amount).toFixed(2)}
		</span>
	);

	const dateTemplate = (row) => {
		const d = new Date(row.date);
		return (
			<span className="text-gray-600">
				{d.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</span>
		);
	};

	const categoryTemplate = (row) => {
		const name = row.category || "Unknown";
		const colors = CATEGORY_COLORS[name] || DEFAULT_COLOR;
		return (
			<span
				className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
			>
				{name}
			</span>
		);
	};

	const actionTemplate = (row) => (
		<Button
			icon="pi pi-trash"
			rounded
			text
			severity="danger"
			onClick={() => deleteExpense(row)}
			tooltip="Delete"
			tooltipOptions={{ position: "top" }}
		/>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<Toast ref={toast} />
			<ConfirmDialog />

			{/* Header */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
							<i className="pi pi-wallet text-white text-lg"></i>
						</div>
						<h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
					</div>
					<div className="flex items-center gap-4">
						<Button
							label="Add Expense"
							icon="pi pi-plus"
							className="p-button-sm"
							onClick={() => setExpenseDialog(true)}
						/>
						<Button
							label="Logout"
							icon="pi pi-sign-out"
							className="p-button-sm p-button-outlined p-button-danger"
							onClick={handleLogout}
						/>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
				{/* Greeting + Insight Cards */}
				<h2 className="text-2xl font-bold text-gray-900">
					Hello, {user.name || "User"} !
				</h2>
				<InsightCards expenses={filteredExpenses} />

				{/* Charts & Filters Row */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ExpenseChart expenses={filteredExpenses} />

					{/* Filters Panel */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							<i className="pi pi-filter mr-2 text-indigo-500"></i>Filters
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-1.5">
									Month
								</label>
								<Calendar
									value={selectedMonth}
									onChange={(e) => setSelectedMonth(e.value)}
									view="month"
									dateFormat="MM yy"
									placeholder="All months"
									showIcon
									showButtonBar
									className="w-full"
									locale="custom"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-1.5">
									Category
								</label>
								<Dropdown
									value={selectedCategory}
									options={DEFAULT_CATEGORIES}
									onChange={(e) => setSelectedCategory(e.value)}
									placeholder="All categories"
									showClear
									className="w-full"
								/>
							</div>
							<Button
								label="Clear Filters"
								icon="pi pi-filter-slash"
								className="p-button-outlined p-button-sm w-full"
								onClick={clearFilters}
								disabled={!selectedMonth && !selectedCategory}
							/>
						</div>

						{/* Quick Summary */}
						<div className="mt-6 pt-6 border-t border-gray-100">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-gray-500">Filtered Total</span>
								<span className="text-xl font-bold text-gray-900">
									₹{totalAmount.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">Transactions</span>
								<span className="text-sm font-medium text-gray-700">
									{filteredExpenses.length}
								</span>
							</div>
							{selectedMonth && (
								<p className="text-xs text-indigo-500 mt-3">
									<i className="pi pi-calendar mr-1"></i>
									{selectedMonth.toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* DataTable */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200">
					<div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<h3 className="text-lg font-semibold text-gray-900">
							<i className="pi pi-list mr-2 text-indigo-500"></i>All Expenses
						</h3>
						<span className="text-sm text-gray-500">
							{filteredExpenses.length} transaction
							{filteredExpenses.length !== 1 ? "s" : ""} &middot; Total:{" "}
							<strong className="text-gray-900">
								₹{totalAmount.toFixed(2)}
							</strong>
						</span>
					</div>

					<DataTable
						value={filteredExpenses}
						loading={loading}
						dataKey="id"
						paginator
						rows={10}
						rowsPerPageOptions={[5, 10, 25]}
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
						currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
						emptyMessage="No expenses found. Click 'Add Expense' to get started."
						sortField="date"
						sortOrder={-1}
						stripedRows
						removableSort
					>
						<Column
							field="date"
							header="Date"
							sortable
							body={dateTemplate}
							style={{ minWidth: "130px" }}
						/>
						<Column
							field="description"
							header="Description"
							sortable
							style={{ minWidth: "200px" }}
						/>
						<Column
							field="category"
							header="Category"
							body={categoryTemplate}
							style={{ minWidth: "150px" }}
						/>
						<Column
							field="amount"
							header="Amount"
							sortable
							body={amountTemplate}
							style={{ minWidth: "120px" }}
							alignHeader="right"
							bodyClassName="text-right"
						/>
						<Column body={actionTemplate} header="" style={{ width: "60px" }} />
					</DataTable>
				</div>
			</main>

			{/* Add Expense Dialog */}
			<AddExpenseDialog
				visible={expenseDialog}
				onHide={() => setExpenseDialog(false)}
				onSave={loadExpenses}
				toast={toast}
				token={token}
			/>
		</div>
	);
}
