import Link from "next/link";
import { ExternalLink, Users, Calendar, Coins, Building } from "lucide-react";
import { motion } from "framer-motion";

export function SchemeCard({ scheme }: { scheme: any }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#111111] rounded-xl border border-white/10 p-6 flex flex-col h-full hover:border-[#FFD700]/50 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-bold text-white">{scheme.schemeName}</h3>
          {scheme.area && (
            <span className="px-3 py-1 bg-white/10 text-[#FFD700] text-xs font-bold rounded-full whitespace-nowrap border border-white/10">
              {scheme.area}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4 text-[#FFD700] text-sm">
          <Building className="w-4 h-4" />
          <span>{scheme.implementingMinistry}</span>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
              <Coins className="w-4 h-4" /> Benefits
            </h4>
            <p className="text-sm text-gray-300 line-clamp-2">{scheme.benefitsSummary}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
              <Users className="w-4 h-4" /> Eligibility
            </h4>
            <p className="text-sm text-gray-300 line-clamp-2">{scheme.eligibilitySummary}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        <Link 
          href={scheme.officialWebsite || "#"} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#FFD700] hover:text-[#E6C200] flex items-center gap-1 transition-colors"
        >
          Official Website <ExternalLink className="w-3 h-3" />
        </Link>
        <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-full transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  );
}
