import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!name.trim()) {
			setError("Name is required.");
			return;
		}
		if (!email.trim()) {
			setError("Email is required.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Registration failed.");
				return;
			}

			setSuccess("Registration successful!");
			setTimeout(() => navigate("/"), 2500);
		} catch (err) {
			setError(err.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<div className="text-center mb-6">
					<i className="pi pi-user-plus text-4xl text-indigo-600 mb-2" />
					<h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
					<p className="text-sm text-gray-500 mt-1">
						Sign up to start managing your expenses
					</p>
				</div>

				{error && (
					<Message severity="error" text={error} className="w-full mb-4" />
				)}
				{success && (
					<Message severity="success" text={success} className="w-full mb-4" />
				)}

				<form onSubmit={handleRegister} className="flex flex-col gap-5">
					{/* Name */}
					<div className="flex flex-col gap-2">
						<label htmlFor="name" className="text-sm font-medium text-gray-700">
							Full Name
						</label>
						<InputText
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Neha Patel"
							className="w-full"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="email"
							className="text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<InputText
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className="w-full"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="password"
							className="text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<div className="relative">
							<InputText
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="confirmPassword"
							className="text-sm font-medium text-gray-700"
						>
							Confirm Password
						</label>
						<div className="relative">
							<InputText
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<Button
						type="submit"
						label={loading ? "Creating Account..." : "Register"}
						icon="pi pi-user-plus"
						loading={loading}
						className="w-full"
					/>
				</form>

				<p className="text-center text-sm text-gray-500 mt-6">
					Already have an account?{" "}
					<Link to="/" className="text-indigo-600 font-medium hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
