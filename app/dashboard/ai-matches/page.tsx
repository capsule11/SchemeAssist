"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getUserProfile } from "@/lib/appwrite";
import { SchemeCard } from "@/components/SchemeCard";
import { Loader2, Sparkles, CheckCircle2, Search } from "lucide-react";

export default function AIMatchesPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState("");
  
  // Staged loading sequence states
  const [loadingStage, setLoadingStage] = useState(0);

  useEffect(() => {
    const initAIMatchSequence = async () => {
      setAiLoading(true);
      setLoadingStage(0);
      
      try {
        // Stage 0: Checking profile (artificial delay for UX)
        const currentUser: any = await getCurrentUser();
        if (!currentUser) throw new Error("Please log in to use AI Matches");
        
        await new Promise(r => setTimeout(r, 1500));
        setLoadingStage(1);

        // Stage 1: Reading Data
        const profile: any = await getUserProfile(currentUser.$id);
        if (!profile) throw new Error("Please complete your profile first under 'My Profile' before using AI matches.");
        setProfileData(profile);
        
        await new Promise(r => setTimeout(r, 1500));
        setLoadingStage(2);
        
        // Stage 2: Finding Perfect Schemes (Actual API Call starts)
        const res = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile)
        });
        
        setLoadingStage(3);
        // Stage 3: Analyzing results
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch AI matches");
        
        setAiMatches(data.schemes || []);
        
      } catch (error: any) {
        console.error("AI Match Error:", error);
        setAiError(error.message);
      } finally {
        setAiLoading(false);
      }
    };

    initAIMatchSequence();
  }, []);

  const loadingSteps = [
    "Checking your profile...",
    "Reading your data...",
    "Finding perfect schemes for you across the web...",
    "Analyzing eligibility criteria..."
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
            <Sparkles className="w-8 h-8 text-[#FFD700]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Scheme Matcher</h1>
          <p className="text-gray-400">Gemini is searching the live web to find the absolute best schemes for your exact profile.</p>
        </div>
      </div>

      {aiError ? (
         <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
             <p className="text-red-400 font-medium mb-4">{aiError}</p>
             <button 
               onClick={() => window.location.reload()}
               className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-6 py-2 rounded-lg transition-colors font-medium"
             >
                 Try Again
             </button>
         </div>
      ) : aiLoading ? (
        <div className="max-w-2xl mx-auto mt-20 p-8 bg-[#111111] rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Search className="w-16 h-16 text-[#FFD700] relative z-10 animate-bounce" />
                </div>
                
                <div className="w-full space-y-4">
                    {loadingSteps.map((step, index) => {
                        const isActive = index === loadingStage;
                        const isPast = index < loadingStage;
                        
                        return (
                            <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : isPast ? 'opacity-50' : 'opacity-20'}`}>
                                {isPast ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                ) : isActive ? (
                                    <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                                )}
                                <span className={`font-medium ${isActive ? 'text-[#FFD700]' : 'text-gray-300'}`}>
                                    {step}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      ) : (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="text-green-500 font-medium">Analysis Complete! Found {aiMatches.length} highly relevant schemes.</span>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors"
                 >
                   Scan Again
                 </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMatches.map((scheme: any, i: number) => (
                <SchemeCard key={i} scheme={scheme} />
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
