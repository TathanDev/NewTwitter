"use client";
import { ThemeProvider } from "@/utils/themeContext";
import { UserProvider } from "../context/UserContext";

export default function ClientProviders({ children, initialUser }) {
  return (
    <ThemeProvider>
      <UserProvider initialUser={initialUser}>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
}
