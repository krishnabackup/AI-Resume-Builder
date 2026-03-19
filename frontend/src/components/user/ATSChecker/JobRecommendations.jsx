import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Target, Sparkles, ChevronRight } from "lucide-react";

export default function JobRecommendations({ extractedData, isAnalyzing }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendations when extracted data changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      // Clear old recommendations if data is empty or still analyzing
      if (!extractedData || Object.keys(extractedData).length === 0 || isAnalyzing) {
        setRecommendations([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        const response = await fetch("http://localhost:5000/api/resume/job-recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ parsedData: extractedData }),
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setRecommendations(data.data);
        } else {
          setError(data.error || "Failed to load recommendations.");
        }
      } catch (err) {
        console.error("Job recommendations fetch error:", err);
        setError("Error connecting to server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [extractedData, isAnalyzing]);

  // Loading Skeleton
  if (isLoading || isAnalyzing) {
    return (
      <div className="mt-4 rounded-xl border border-blue-100 bg-white overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold bg-blue-50 text-blue-800">
          <Sparkles size={15} className="text-blue-600 animate-pulse" />
          Finding Best Roles For You...
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="flex gap-2 mt-1">
                <div className="h-5 w-12 bg-slate-200 rounded-full"></div>
                <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="mt-4 rounded-xl border border-red-100 bg-white overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold bg-red-50 text-red-700">
          <Target size={15} />
          Job Recommendations Unavailable
        </div>
        <div className="p-4 text-sm text-slate-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  // Empty State (No resume uploaded yet)
  if (!extractedData || Object.keys(extractedData).length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-slate-100 bg-white overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold bg-slate-50 text-slate-700">
          <Briefcase size={15} />
          Job Recommendations
        </div>
        <div className="p-6 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Briefcase size={18} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">Upload a resume to get job recommendations</p>
          <p className="text-xs text-slate-400 mt-1">We'll scan your skills to find the best matching roles.</p>
        </div>
      </div>
    );
  }

  // Loaded State
  return (
    <div className="mt-4 rounded-xl border border-indigo-100 bg-white overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold bg-indigo-50 text-indigo-800">
        <Briefcase size={15} className="text-indigo-600" />
        Recommended Roles
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 cursor-default">
          {recommendations.length} Matches
        </span>
      </div>
      
      <div className="overflow-auto max-h-[400px] p-2 flex flex-col gap-2">
        <AnimatePresence>
          {recommendations.map((job, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="group p-3.5 bg-white border border-slate-100 rounded-xl hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200 flex flex-col gap-1.5 cursor-pointer relative"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors pr-6">
                  {job.title}
                </h3>
                {job.level && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 whitespace-nowrap">
                    {job.level}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-1">
                {job.skills?.slice(0, 4).map((skill, si) => (
                  <span 
                    key={si}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills?.length > 4 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {recommendations.length === 0 && !isLoading && !isAnalyzing && (
          <div className="p-4 text-center text-sm text-slate-500">
            No specific roles found right now. Try adding more skills to your resume.
          </div>
        )}
      </div>
    </div>
  );
}
