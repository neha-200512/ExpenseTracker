import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";
const JWT_EXPIRES_IN = "7d";

// POST /api/auth/register
const register = async (req, res) => {
	try {
		const prisma = req.app.locals.prisma;
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required." });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters." });
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "User with this email already exists." });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		// Generate token
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		return res.status(201).json({
			message: "Registration successful.",
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("Register error:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};

// POST /api/auth/login
const login = async (req, res) => {
	try {
		const prisma = req.app.locals.prisma;
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required." });
		}

		// Find user
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password." });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid email or password." });
		}

		// Generate token
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		return res.status(200).json({
			message: "Login successful.",
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
	try {
		const prisma = req.app.locals.prisma;
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: { id: true, name: true, email: true },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		return res.status(200).json({ user });
	} catch (error) {
		console.error("GetMe error:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};

export default { register, login, getMe };
