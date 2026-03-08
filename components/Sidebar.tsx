"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, List, UserCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { logoutUser } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Schemes", href: "/dashboard/schemes", icon: List },
    { name: "My Profile", href: "/profile", icon: UserCircle },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
          <span className="text-xl font-bold tracking-tight text-white">SchemeAssist</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-[#FFD700]/10 text-[#FFD700]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-[#FFD700]" : "text-gray-400"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );
}
