"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser, confirmVerification, sendVerificationEmail } from "@/lib/appwrite";
import { ShieldCheck, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "success" | "error" | "resend_success">("pending");
  const [message, setMessage] = useState("We sent a verification link to your email. Please click it to continue.");

  useEffect(() => {
    const handleVerification = async () => {
      try {
        if (userId && secret) {
          // User clicked the link in their email
          setStatus("pending");
          setMessage("Verifying your email...");
          await confirmVerification(userId, secret);
          setStatus("success");
          setMessage("Your email has been verified! Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 3000);
        } else {
          // User just landed here after signup or from a guarded route
          const user: any = await getCurrentUser();
          if (!user) {
            router.push("/Login");
            return;
          }
          if (user.emailVerification) {
            router.push("/dashboard");
          } else {
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(error.message || "Failed to verify email. The link may be expired or invalid.");
      } finally {
        if (userId && secret) {
           setLoading(false);
        }
      }
    };

    handleVerification();
  }, [userId, secret, router]);

  const handleResend = async () => {
    try {
      setLoading(true);
      await sendVerificationEmail();
      setStatus("resend_success");
      setMessage("A new verification link has been sent to your email!");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Failed to resend email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex justify-center items-center gap-2 mb-8">
          <ShieldCheck className="w-10 h-10 text-[#FFD700]" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          {status === 'success' ? 'Email Verified' : 'Verify your email'}
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-[#111111] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10 text-center flex flex-col items-center">
           
           {status === 'pending' && !userId && (
               <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20 text-[#FFD700]">
                  <Mail className="w-8 h-8" />
               </div>
           )}

           {(loading || (status === 'pending' && userId)) && (
               <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20 text-[#FFD700]">
                  <Loader2 className="w-8 h-8 animate-spin" />
               </div>
           )}

           {status === 'success' && (
               <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 text-green-500">
                  <CheckCircle className="w-8 h-8" />
               </div>
           )}

           {status === 'error' && (
               <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 text-red-500">
                  <XCircle className="w-8 h-8" />
               </div>
           )}

           {status === 'resend_success' && (
               <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20 text-[#FFD700]">
                  <Mail className="w-8 h-8" />
               </div>
           )}
           
           <p className="text-gray-300 text-lg mb-8">{message}</p>

           {status !== 'success' && status !== 'resend_success' && (
               <button
                 onClick={handleResend}
                 disabled={loading}
                 className="w-full flex justify-center py-3 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors disabled:opacity-50"
               >
                 {loading ? "Please wait..." : "Resend Verification Email"}
               </button>
           )}

           {status === 'resend_success' && (
                <button
                onClick={() => router.push("/Login")}
                className="w-full flex justify-center py-3 border border-[#FFD700] rounded-xl text-sm font-medium text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
              >
                Return to Login
              </button>
           )}

        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
