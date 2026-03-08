"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/Login" || pathname === "/Signup";
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

  if (isAuthPage || isDashboard) return null;

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
              <span className="text-xl font-bold tracking-tight text-white">SchemeAssist</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Empowering citizens to discover, understand, and apply for government schemes they are eligible for.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-[#FFD700] transition-colors">Home</Link></li>
              <li><Link href="#schemes" className="text-gray-400 hover:text-[#FFD700] transition-colors">All Schemes</Link></li>
              <li><Link href="#how-it-works" className="text-gray-400 hover:text-[#FFD700] transition-colors">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SchemeAssist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
