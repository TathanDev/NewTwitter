"use client";
import { ThemeProvider } from "@/utils/themeContext";
import { UserProvider } from "../context/UserContext";
import SessionWatcher from "./SessionWatcher";

export default function ClientProviders({ children, initialUser }) {
  return (
    <ThemeProvider>
      <UserProvider initialUser={initialUser}>
        <SessionWatcher />
        {children}
      </UserProvider>
    </ThemeProvider>
  );
}
