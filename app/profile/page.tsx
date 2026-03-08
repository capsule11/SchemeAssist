"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUserProfile, createOrUpdateProfile, logoutUser, deleteUserProfile } from "@/lib/appwrite";
import { Loader2, Save, AlertCircle, LogOut, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    state: "",
    district: "",
    areaType: "",
    category: "",
    income: "", 
    occupation: "",
    educationLevel: "",
    isTaxPayer: false,
    isGovEmployee: false,
    isPhysicallyDisabled: false,
    hasBPLCard: false,
    religion: "",
    landHolding: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser: any = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Pre-fill from Auth User
          setFormData(prev => ({
            ...prev,
            name: currentUser.name || "",
            email: currentUser.email || "",
          }));

          // Fetch Existing Profile
          const profile: any = await getUserProfile(currentUser.$id);
          if (profile) {
            setFormData(prev => ({ 
              ...prev, 
              ...profile,
              // Coerce to string for inputs
              income: profile.income ? String(profile.income) : "",
              age: profile.age ? String(profile.age) : "",
              landHolding: profile.landHolding ? String(profile.landHolding) : "",
              // Map exactly matching booleans
              isTaxPayer: !!profile.isTaxPayer,
              isGovEmployee: !!profile.isGovEmployee,
              isPhysicallyDisabled: !!profile.isPhysicallyDisabled,
              hasBPLCard: !!profile.hasBPLCard,
            }));
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    
    // Explicitly construct payload to match 18 Appwrite Attributes exactly
    const dataToSave = {
      userId: user.$id,
      name: formData.name,
      email: formData.email,
      state: formData.state,
      age: formData.age ? parseInt(formData.age, 10) : 0,
      income: formData.income ? parseInt(formData.income, 10) : 0, // Using integer for Appwrite compatibility
      occupation: formData.occupation,
      district: formData.district,
      areaType: formData.areaType,
      religion: formData.religion || "Not Specified",
      isPhysicallyDisabled: !!formData.isPhysicallyDisabled,
      isTaxPayer: !!formData.isTaxPayer,
      isGovEmployee: !!formData.isGovEmployee,
      landHolding: formData.landHolding ? parseInt(formData.landHolding, 10) : 0, 
      educationLevel: formData.educationLevel,
      hasBPLCard: !!formData.hasBPLCard,
      gender: formData.gender,
      category: formData.category,
    };

    try {
      if (!user) return;
      await createOrUpdateProfile(user.$id, dataToSave);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      console.error("Save error", error);
      setMessage({ text: error.message || "Failed to update profile. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteUserProfile(user.$id);
      router.push("/login");
    } catch (error: any) {
      console.error("Deletion failed", error);
      setMessage({ text: error.message || "Failed to delete profile.", type: "error" });
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Complete your details to unlock highly accurate scheme recommendations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20 font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors border border-white/10 font-medium text-sm disabled:opacity-50"
          >
            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Logout
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-500' 
            : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#111111] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-8">
        
        {/* Section: Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] border-b border-white/10 pb-2 mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] appearance-none">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
             </div>
          </div>
        </div>

        {/* Section: Location & Demographics */}
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] border-b border-white/10 pb-2 mb-4">Location & Community</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" placeholder="e.g. Maharashtra" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Area Type</label>
                <select name="areaType" value={formData.areaType} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] appearance-none">
                  <option value="">Select Area Type</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category (Caste)</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] appearance-none">
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" placeholder="e.g. Hindu, Muslim, Christian" />
             </div>
          </div>
        </div>

        {/* Section: Professional & Financial Details */}
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] border-b border-white/10 pb-2 mb-4">Professional & Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Annual Income</label>
                <input type="number" name="income" value={formData.income} onChange={handleChange} min="0" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" placeholder="In Rupees (₹)" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" placeholder="e.g. Farmer, Student, IT" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Education Level</label>
                <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" placeholder="e.g. 10th Pass, Graduate" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-400 mb-1">Land Holding Size (Acres/Hectares)</label>
               <input type="number" name="landHolding" value={formData.landHolding} onChange={handleChange} min="0" required className="w-full bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]" placeholder="0 if None" />
             </div>
          </div>
        </div>

        {/* Section: Boolean Status Checkboxes */}
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] border-b border-white/10 pb-2 mb-4">Specialized Statuses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" name="hasBPLCard" checked={formData.hasBPLCard} onChange={handleChange} className="w-5 h-5 accent-[#FFD700] bg-black/50 border-white/20" />
              <span className="text-sm font-medium text-gray-300">Has BPL Card</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" name="isPhysicallyDisabled" checked={formData.isPhysicallyDisabled} onChange={handleChange} className="w-5 h-5 accent-[#FFD700] bg-black/50 border-white/20" />
              <span className="text-sm font-medium text-gray-300">Physically Disabled</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" name="isTaxPayer" checked={formData.isTaxPayer} onChange={handleChange} className="w-5 h-5 accent-[#FFD700] bg-black/50 border-white/20" />
              <span className="text-sm font-medium text-gray-300">Income Tax Payer</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" name="isGovEmployee" checked={formData.isGovEmployee} onChange={handleChange} className="w-5 h-5 accent-[#FFD700] bg-black/50 border-white/20" />
              <span className="text-sm font-medium text-gray-300">Govt Employee</span>
            </label>

          </div>
        </div>

        <div className="pt-6 flex justify-end border-t border-white/10 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#E6C200] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Profile & Data?</h3>
            <p className="text-gray-400 mb-6 text-sm">
              This action cannot be undone. This will permanently delete your profile, 
              remove your data from our servers, and log you out immediately.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProfile}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting..." : "Yes, Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
