import { BrowserRouter, Routes, Route } from "react-router-dom";

import Chat from "@/pages/chat/Chat";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Settings from "@/pages/settings/Settings";
import Documents from "@/pages/documents/Documents";
import Workspaces from "@/pages/workspace/Workspaces";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
  path="/documents"
  element={<Documents />}
/>
<Route
  path="/workspaces"
  element={<Workspaces />}
/>

      </Routes>
    </BrowserRouter>
  );
}