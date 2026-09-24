"use client";

import React, { Suspense, useState } from "react";
import { TherapistProfileProvider } from "@/context/ProfileTerapisContext";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

export default function TerapisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <TherapistProfileProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
            Memuat halaman...
          </div>
        }
      >
        <div className="flex h-screen bg-[#F4F9F8] overflow-hidden">
          {/* SIDEBAR */}
          <SidebarTerapis
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* MAIN AREA */}
          <div className="flex flex-col flex-1 relative overflow-hidden">
            {/* HEADER */}
            <header className="sticky top-0 z-30">
              <HeaderTerapis onOpenSidebar={() => setIsSidebarOpen(true)} />
            </header>

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </Suspense>
    </TherapistProfileProvider>
  );
}