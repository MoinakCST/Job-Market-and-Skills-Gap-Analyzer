import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";
import Reports from "./features/interview/pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/interview",
    element: (
      <ProtectedRoute>
        <Interview />
      </ProtectedRoute>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <ProtectedRoute>
        <Interview />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
]);