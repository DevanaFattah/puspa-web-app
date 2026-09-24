"use client";

import React, { Suspense, useState } from "react";
import SidebarOwner from "@/components/layout/sidebar_owner";
import HeaderOwner from "@/components/layout/header_owner";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
          Memuat halaman...
        </div>
      }
    >
      <div className="flex h-screen bg-[#F4F9F8] overflow-hidden">
        {/* SIDEBAR */}
        <SidebarOwner
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* MAIN AREA */}
        <div className="flex flex-col flex-1 relative overflow-hidden">
          {/* HEADER */}
          <header className="sticky top-0 z-30">
            <HeaderOwner onOpenSidebar={() => setIsSidebarOpen(true)} />
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
