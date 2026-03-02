import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { API_BASE } from "../lib/api.js";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

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

export default function AddExpenseDialog({
	visible,
	onHide,
	onSave,
	toast,
	token,
}) {
	const [expense, setExpense] = useState({
		amount: null,
		description: "",
		date: new Date(),
		category: null,
	});

	const saveExpense = async () => {
		if (!expense.amount || !expense.description || !expense.category) {
			toast.current.show({
				severity: "warn",
				summary: "Warning",
				detail: "Please fill all required fields",
			});
			return;
		}

		try {
			const response = await fetch(`${API_BASE}/api/expenses`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(expense),
			});

			if (response.ok) {
				toast.current.show({
					severity: "success",
					summary: "Success",
					detail: "Expense added",
				});
				onSave();
				resetForm();
				onHide();
			}
		} catch {
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to add expense",
			});
		}
	};

	const resetForm = () => {
		setExpense({
			amount: null,
			description: "",
			date: new Date(),
			category: null,
		});
	};

	return (
		<Dialog
			visible={visible}
			style={{ width: "480px" }}
			header={
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
						<i className="pi pi-plus text-indigo-600"></i>
					</div>
					<span>Add Expense</span>
				</div>
			}
			modal
			draggable={false}
			onHide={() => {
				resetForm();
				onHide();
			}}
		>
			<div className="space-y-5 pt-2">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Amount *
					</label>
					<InputNumber
						value={expense.amount}
						onValueChange={(e) => setExpense({ ...expense, amount: e.value })}
						mode="currency"
						currency="INR"
						locale="en-IN"
						className="w-full"
						placeholder="0.00"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Category *
					</label>
					<Dropdown
						value={expense.category}
						options={DEFAULT_CATEGORIES}
						onChange={(e) => setExpense({ ...expense, category: e.value })}
						placeholder="Select a category"
						className="w-full"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Description *
					</label>
					<InputText
						value={expense.description}
						onChange={(e) =>
							setExpense({ ...expense, description: e.target.value })
						}
						className="w-full"
						placeholder="What was this expense for?"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Date *
					</label>
					<Calendar
						value={expense.date}
						onChange={(e) => setExpense({ ...expense, date: e.value })}
						showIcon
						className="w-full"
						dateFormat="M dd, yy"
						maxDate={new Date()}
					/>
				</div>
			</div>

			<div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
				<Button
					label="Cancel"
					className="p-button-text p-button-sm"
					onClick={() => {
						resetForm();
						onHide();
					}}
				/>
				<Button
					label="Add Expense"
					icon="pi pi-check"
					className="p-button-sm"
					onClick={saveExpense}
				/>
			</div>
		</Dialog>
	);
}
