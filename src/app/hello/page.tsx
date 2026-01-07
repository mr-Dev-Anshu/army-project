// app/test/page.tsx
"use client";

import { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

export default function TestPage() {
  const { setCollapsed } = useSidebar();







  // Collapse sidebar when this page mounts
  useEffect(() => {
    setCollapsed(true);
    
    // Optional: reset when leaving the page
    return () => {
      setCollapsed(false); // or keep last user preference
    };
  }, [setCollapsed]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Test Page</h1>
      <p>This page starts with collapsed sidebar by default.</p>
      
      <div className="h-[200vh] bg-gradient-to-b from-blue-50 to-purple-50">
        Long content to test scrolling...
      </div>
    </div>
  );
}