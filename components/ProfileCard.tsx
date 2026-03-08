import Link from "next/link";
import { User, CheckCircle, AlertCircle } from "lucide-react";

export function ProfileCard({ user, profileData }: { user: any, profileData: any }) {
  const isProfileComplete = !!profileData;

  return (
    <div className="bg-[#111111] rounded-xl border border-white/10 p-6 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center border border-[#FFD700]/20">
            <User className="w-8 h-8 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name || "User"}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
        
        {isProfileComplete ? (
          <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full text-sm font-medium border border-green-500/20">
            <CheckCircle className="w-4 h-4" />
            Profile Complete
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full text-sm font-medium border border-yellow-500/20">
            <AlertCircle className="w-4 h-4" />
            Profile Incomplete
          </div>
        )}
      </div>

      {!isProfileComplete && (
        <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-4">
            Complete your profile to get personalized scheme recommendations and unlock full access to eligible benefits.
          </p>
          <Link 
            href="/profile"
            className="inline-block bg-[#FFD700] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#E6C200] transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {isProfileComplete && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">State</p>
            <p className="text-sm text-white font-medium">{profileData.state}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Age</p>
            <p className="text-sm text-white font-medium">{profileData.age} Years</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Income</p>
            <p className="text-sm text-white font-medium">₹{profileData.income || profileData.annualIncome}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="text-sm text-white font-medium">{profileData.category}</p>
          </div>
        </div>
      )}
    </div>
  );
}
