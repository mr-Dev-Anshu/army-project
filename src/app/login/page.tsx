"use client";

import React, { useEffect } from 'react';
import { Eye, User, Lock, ArrowRightSquare, ShieldCheck, LifeBuoy, Activity, EyeOff } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for saved credentials on component mount
  useEffect(() => {
    if (user) {
      toast.info("Welcome back! Redirecting to dashboard...");
      router.push("/");
      return;
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      router.push("/");
      router.refresh();
    } catch (error) {
      // Error is already handled by AuthContext
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full bg-white font-sans overflow-hidden">
      
      {/* LEFT SIDE: Hero Section */}
      {/* LEFT SIDE: Hero Section */}
      <section className="relative hidden w-3/5 flex-col justify-between p-12 lg:flex overflow-hidden">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110"
          style={{ 
            backgroundImage: "url('/military.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* TACTICAL BLUE FILTER OVERLAYS */}
        {/* 1. Deep Blue Tint (Multiplication layer for that "Night Vision/Tactical" look) */}
        <div className="absolute inset-0 z-[1] bg-[#001a3d] opacity-70 mix-blend-multiply"></div>
        
        {/* 2. Gradient Overlay (Ensures text readability on the left) */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#000d1a] via-transparent to-[#001a3d]/40"></div>
        
        {/* 3. Subtle Cyan Glow (Optional: Adds a high-tech sheen) */}
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
  <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>

  {/* Branding Header */}
  <div className="relative z-10 flex items-center gap-4">
    <div className="bg-white p-1.5 rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
      <div className="w-4 h-4 bg-slate-900"></div>
    </div>
    <div className="flex flex-col">
      <h2 className="text-[40px] font-bold tracking-tighter text-white uppercase leading-none">
        Provost | 21 Corps
      </h2>
      <span className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] uppercase">
        Central Command
      </span>
    </div>
  </div>

  {/* Hero Content */}
  <div className="relative z-1 max-w-xl">
    <h1 className="mb-6 text-2xl font-black leading-[0.95] text-white tracking-tighter drop-shadow-xl">
      SECURING 
      STRATEGIC <br /> 
      OPERATIONS
      GLOBALLY.
    </h1>
    <p className="text-xl text-blue-100/70 leading-relaxed font-light border-l-2 border-cyan-500/50 pl-6">
      Integrated intelligence, surveillance, and tactical management platform 
      for authorized personnel only.
    </p>
  </div>

  {/* Footer Info */}
  <div className="relative z-10 flex gap-8 text-[10px] font-bold tracking-[0.2em] text-blue-300/50 uppercase">
    <div className="flex items-center gap-3">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <span>Network Status: Online</span>
    </div>
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/50" />
      <span>Encrypted: AES-256</span>
    </div>
  </div>
</section>

      {/* RIGHT SIDE: Login Form */}
      <section className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-2/5 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-4xl font-bold text-slate-900">Sign In</h2>
          <p className="mt-4 text-slate-500">
            Enter your service credentials to access the secure network.
          </p>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Username/Army Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Army Number / Username
              </label>
              <div className="relative">
                <input
                  {...register("username")}
                  type="text"
                  placeholder="e.g. SN-884920"
                  className="w-full border border-slate-200 rounded-md py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-300"
                  disabled={isLoading}
                />
                <User className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.username && (
                <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Security Password
                </label>
                <button type="button" className="text-xs font-bold text-[#003eb3] hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-md py-3.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>}
            </div>

            {/* Session Stay */}
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="session" 
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="session" className="text-xs font-medium text-slate-500 cursor-pointer">
                Keep session active for 8 hours
              </label>
            </div>

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#003eb3] py-4 text-xs font-bold tracking-[0.15em] text-white uppercase transition-all hover:bg-blue-800 active:scale-[0.98] shadow-xl shadow-blue-900/20 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRightSquare className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* System Info Links */}
          <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6 text-slate-400">
            <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider hover:text-slate-700 transition-colors">
              <LifeBuoy className="h-4 w-4" />
              System Support
            </button>
            <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider hover:text-slate-700 transition-colors">
              <Activity className="h-4 w-4" />
              System Status
            </button>
          </div>

          {/* Disclaimer */}
          <p className="mt-10 text-center text-[9px] uppercase leading-relaxed tracking-widest text-slate-400">
            Authorized personnel only. All activities within this portal are monitored and logged. 
            Unauthorized access is subject to military prosecution.
          </p>
        </div>
      </section>
    </main>
  );
}