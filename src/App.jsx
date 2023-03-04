import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },

  {
    path: "register",
    element: (
      <Register />
    ),
  },

  {
    path: "login",
    element: (
      <Login />
    ),
  },
]);

function ProtectedRoute ({ children }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!currentUser) navigate("/login");
  return children;
}

function ProtectedAuthRoute ({ children }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  if (currentUser) navigate("/");
  return children;
}

function App () {
  return <RouterProvider router={router} />;
}

export default App;
