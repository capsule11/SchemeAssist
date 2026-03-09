"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getUserProfile, fetchAllSchemes } from "@/lib/appwrite";
import { ProfileCard } from "@/components/ProfileCard";
import { SchemeCard } from "@/components/SchemeCard";
import { Loader2, Search } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentUser: any = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const profileDataFetched = await getUserProfile(currentUser.$id);
          setProfileData(profileDataFetched);
        }

        const allSchemes = await fetchAllSchemes();
        setSchemes(allSchemes);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  const searchedSchemes = schemes.filter(s => 
    s.schemeName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.benefitsSummary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Discover and track your government schemes from one place.</p>
      </div>

      <ProfileCard user={user} profileData={profileData} />

      <div className="mt-12 border-t border-white/10 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-white">All Active Schemes</h2>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:bg-[#111111]"
              placeholder="Search schemes, benefits..."
            />
          </div>
        </div>

        {schemes.length === 0 ? (
          <div className="text-center py-12 bg-[#111111] rounded-xl border border-white/10">
            <p className="text-gray-400">No schemes found in the database. Please add schemes to your Appwrite collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedSchemes.map((scheme) => (
              <SchemeCard key={scheme.$id || scheme.schemeName} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
