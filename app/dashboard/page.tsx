"use client";

import { App } from "@/src/App";
import { AppProvider } from "@/src/context/AppContext";

export default function DashboardPage() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}