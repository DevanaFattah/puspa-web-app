"use client";

import React, { useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function ResponsiveOrangtuaLayout({
  children,
  maxWidth = "max-w-5xl",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F4F9F8] overflow-hidden">
      {/* SIDEBAR */}
      <SidebarOrangtua
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* CONTENT */}
      <div className="flex flex-col flex-1 relative overflow-hidden">
        {/* HEADER */}
        <header className="sticky top-0 z-30">
          <HeaderOrangtua onOpenSidebar={() => setSidebarOpen(true)} />
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Scrollable container with padding */}
          <div className={`mx-auto w-full ${maxWidth}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}