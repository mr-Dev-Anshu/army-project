"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface RouteProtectionProps {
  children: React.ReactNode;
}

export default function RouteProtection({ children }: RouteProtectionProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication is still loading, don't do anything yet
    if (isLoading) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render children (will redirect)
  if (!user) {
    return null;
  }

  // If user is authenticated, render the children
  return <>{children}</>;
}
