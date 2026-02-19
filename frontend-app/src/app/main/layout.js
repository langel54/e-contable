import { ProtectedRoute } from "../components/ProtectedRoute";
import ResponsiveDrawer from "./drawer/Drawer";
import AuthGuard from "./menu/AuthGuard";

export default function RootLayout({ children }) {
  return (
    <ProtectedRoute>
      <ResponsiveDrawer>
        <AuthGuard>{children}</AuthGuard>
      </ResponsiveDrawer>
    </ProtectedRoute>
  );
}
