"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, FileText, CheckCircle, ShieldCheck } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 via-[#0a0a0a] to-[#0a0a0a]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[#FFD700] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
              </span>
              Over 500+ Government Schemes Listed
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
              Find The Right Government <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">Schemes For You</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Based on your age, income, and background, SchemeAssist instantly discovering the benefits you're legally entitled to receive.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/Signup" 
                className="w-full sm:w-auto px-8 py-4 bg-[#FFD700] hover:bg-[#E6C200] text-black font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Find My Schemes <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 transition-all flex items-center justify-center"
              >
                How it works
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why choose SchemeAssist?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We cut through the red tape to get you direct access to the schemes meant for you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Feature 1 */}
            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-7 h-7 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Discovery</h3>
              <p className="text-gray-400">Our algorithm matches your profile against thousands of state and central schemes instantly.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-7 h-7 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Simplified Details</h3>
              <p className="text-gray-400">Complex eligibility criteria translated into plain English. Know exactly what documents you need.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-7 h-7 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Free & Secure</h3>
              <p className="text-gray-400">Your data is yours. We securely use it only to match you with benefits, without hiding anything behind a paywall.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
             <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to claim what is rightfully yours.</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0a0a0a] border-2 border-[#FFD700] rounded-full flex items-center justify-center text-[#FFD700] text-2xl font-bold mx-auto mb-6 relative">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Create Profile</h3>
                <p className="text-gray-400">Input your basic details safely and securely into our encrypted system.</p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0a0a0a] border-2 border-[#FFD700] rounded-full flex items-center justify-center text-[#FFD700] text-2xl font-bold mx-auto mb-6 relative">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Get Matched</h3>
                <p className="text-gray-400">Instantly see all Central and State government schemes you qualify for.</p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0a0a0a] border-2 border-[#FFD700] rounded-full flex items-center justify-center text-[#FFD700] text-2xl font-bold mx-auto mb-6 relative">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Apply Directly</h3>
                <p className="text-gray-400">Get direct links to official portals along with a simplified checklist of required documents.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-[#FFD700]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to claim your benefits?</h2>
          <p className="text-xl text-black/80 mb-10">Join thousands of citizens already utilizing SchemeAssist.</p>
          <Link 
            href="/Signup" 
            className="inline-block px-10 py-5 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-all transform hover:scale-105 shadow-2xl"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
