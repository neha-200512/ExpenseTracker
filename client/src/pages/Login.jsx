import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../lib/api.js";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Eye, EyeOff } from "lucide-react";
import { Toast } from "primereact/toast";
export default function Login() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Email is required.");
			return;
		}
		if (!password) {
			setError("Password is required.");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(`${API_BASE}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message || "Login failed.");
				return;
			}

			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));

			navigate("/expenses");
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
					<i className="pi pi-wallet text-4xl text-indigo-600 mb-2" />
					<h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
					<p className="text-sm text-gray-500 mt-1">
						Sign in to manage your expenses
					</p>
				</div>

				{error && (
					<Message severity="error" text={error} className="w-full mb-4" />
				)}

				<form onSubmit={handleLogin} className="flex flex-col gap-5">
					{/* Email */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="email"
							className="text-sm  font-medium text-gray-700"
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

					{/* Password */}
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

					<Button
						type="submit"
						label={loading ? "Signing in..." : "Sign In"}
						icon="pi pi-sign-in"
						loading={loading}
						className="w-full"
					/>
				</form>

				<p className="text-center text-sm text-gray-500 mt-6">
					Don&apos;t have an account?{" "}
					<Link
						to="/register"
						className="text-indigo-600 font-medium hover:underline"
					>
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}
