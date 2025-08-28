import { ProtectedRoute } from "../components/ProtectedRoute";
import ResponsiveDrawer from "./drawer/Drawer";

export default function RootLayout({ children }) {
  return (
    <ProtectedRoute>
      <ResponsiveDrawer>{children}</ResponsiveDrawer>
    </ProtectedRoute>
  );
}
