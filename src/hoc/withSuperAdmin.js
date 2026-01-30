"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const withAdminAuth = (Component) => {
  return function ProtectedRoute(props) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        const isAdmin =  user?.role === "superadmin";
        if (!user || !isAdmin) {
          router.push("/");
        }
      }
    }, [user, isLoading, router]);

    if (isLoading || !user ) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
};