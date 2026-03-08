"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, logoutUser } from "@/lib/appwrite";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingObj, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const isAuthPage = pathname === "/Login" || pathname === "/Signup";
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

  if (isAuthPage || isDashboard) return null; // Hide on auth & dashboard pages (dashboard has sidebar)

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Schemes", href: "#schemes" },
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
            <span className="text-xl font-bold tracking-tight text-white">SchemeAssist</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-[#FFD700] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {!loadingObj && user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-white hover:text-[#FFD700] transition-colors bg-white/5 px-4 py-2 border border-white/10 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium bg-[#111] text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/Login"
                    className="text-sm font-medium text-white hover:text-[#FFD700] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/Signup"
                    className="text-sm font-medium bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#E6C200] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-b border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-gray-300 hover:text-[#FFD700]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {!loadingObj && user ? (
                 <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-base font-medium bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full justify-center flex items-center gap-2 text-base font-medium bg-[#111] text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                 </>
              ) : (
                <>
                  <Link
                    href="/Login"
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-medium text-gray-300 hover:text-[#FFD700]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/Signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-base font-medium bg-[#FFD700] text-black px-4 py-2 rounded-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
