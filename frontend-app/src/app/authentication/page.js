"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from "./login";

export default function HomePage() {
  //   const router = useRouter();

  //   useEffect(() => {
  //     router.push("/login"); // Redirigir al login
  //   }, [router]);

  return <Login />; // No renderiza nada, solo redirige
}
