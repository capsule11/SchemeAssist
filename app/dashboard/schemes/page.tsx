"use client";

import { useEffect, useState } from "react";
import { fetchAllSchemes } from "@/lib/appwrite";
import { SchemeCard } from "@/components/SchemeCard";
import { Loader2, Search } from "lucide-react";

export default function AllSchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Agriculture", "Education", "Health", "Business", "Women", "Seniors", "General"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allSchemes = await fetchAllSchemes();
        setSchemes(allSchemes || []);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSchemes = schemes.filter(s => {
    const searchMatch = 
      (s.schemeName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (s.benefitsSummary?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
    if (!searchMatch) return false;
    if (activeFilter === "All") return true;
    
    // Filter by exact area tag matching the database
    if (s.area && s.area === activeFilter) {
      return true;
    }

    // Fallback if the area is missing for any reason
    const searchableText = `${s.schemeName} ${s.implementingMinistry} ${s.benefitsSummary} ${s.eligibilitySummary}`.toLowerCase();
    
    // Explicit fallbacks for each category in case `s.area` is not defined locally yet
    if (activeFilter === "Agriculture") {
      return searchableText.includes("agri") || searchableText.includes("farmer") || searchableText.includes("kisan") || searchableText.includes("crop");
    }
    if (activeFilter === "Health") {
      return searchableText.includes("health") || searchableText.includes("medical") || searchableText.includes("bima") || searchableText.includes("ayushman");
    }
    if (activeFilter === "Education") {
      return searchableText.includes("education") || searchableText.includes("scholarship") || searchableText.includes("school") || searchableText.includes("student");
    }
    if (activeFilter === "Women") {
      return searchableText.includes("women") || searchableText.includes("mahila") || searchableText.includes("girl") || searchableText.includes("maternity") || searchableText.includes("ladli");
    }
    if (activeFilter === "Business") {
      return searchableText.includes("business") || searchableText.includes("startup") || searchableText.includes("msme") || searchableText.includes("mudra");
    }
    if (activeFilter === "Seniors") {
      return searchableText.includes("senior") || searchableText.includes("vridha") || searchableText.includes("pension") || searchableText.includes("old age");
    }
    if (activeFilter === "General") {
      const isAgri = searchableText.includes("agri") || searchableText.includes("farmer") || searchableText.includes("kisan") || searchableText.includes("crop");
      const isHealth = searchableText.includes("health") || searchableText.includes("medical") || searchableText.includes("bima");
      const isEdu = searchableText.includes("education") || searchableText.includes("scholarship") || searchableText.includes("school");
      const isWomen = searchableText.includes("women") || searchableText.includes("mahila") || searchableText.includes("girl");
      const isSeniors = searchableText.includes("senior") || searchableText.includes("pension");
      const isBusiness = searchableText.includes("business") || searchableText.includes("startup") || searchableText.includes("msme");
      
      return !isAgri && !isHealth && !isEdu && !isWomen && !isSeniors && !isBusiness;
    }
    
    return searchableText.includes(activeFilter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Government Schemes</h1>
          <p className="text-gray-400">Browse through the entire repository of available schemes.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text"
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-[#FFD700] text-black"
                : "bg-[#111111] border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme: any) => (
            <SchemeCard key={scheme.$id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#111111] rounded-xl border border-white/10">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Schemes Found</h3>
          <p className="text-gray-400">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
