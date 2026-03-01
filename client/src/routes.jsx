import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Expenses from "./pages/Expenses.jsx";

const routes = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/expenses",
		element: <Expenses />,
	},
]);

export default routes;
