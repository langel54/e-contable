"use client"
import AuthGuard from "../menu/AuthGuard";

export const layout = ({ children }) => {
  return <AuthGuard allowedRoles={[3]}>{children}</AuthGuard>;
};
