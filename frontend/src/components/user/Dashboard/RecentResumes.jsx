import { LuFileText, LuClock, LuPenTool, LuDownload, LuTarget } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa";
import { HiSparkles, HiOutlineDocumentSearch } from "react-icons/hi";

const RecentResumes = ({ resumes = [] }) => {
  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return diffInHours < 1 ? "Just now" : `${Math.floor(diffInHours)}h ago`;
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Mock Resume Health Data Generator (Since actual data structure might not hold these per-resume yet)
  const getMockHealthData = (index) => {
    const scores = [85, 62, 92, 45, 78];
    const score = scores[index % scores.length];

    let status = { label: "Needs Work", color: "bg-red-100 text-red-700", ringName: "text-red-500", progress: score };
    if (score >= 80) status = { label: "Interview Ready", color: "bg-emerald-100 text-emerald-700", ringName: "text-emerald-500", progress: score };
    else if (score >= 60) status = { label: "Optimized", color: "bg-blue-100 text-blue-700", ringName: "text-blue-500", progress: score };

    return status;
  };

  return (
    <div className="flex flex-col w-full h-full relative">

      {/* Header Container */}
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
            <HiSparkles className="text-blue-500" /> Resume Activity Hub
          </h3>
          <p className="text-xs text-slate-500 font-medium">Your recently touched documents and their optimization status.</p>
        </div>
      </div>

      {/* Cards Container - Horizontal Scroll on Desktop, Stack on Mobile */}
      <div className="flex overflow-x-auto pb-6 pt-2 px-2 -mx-2 gap-4 snap-x hide-scrollbar">
        {resumes.length > 0 ? (
          resumes.map((resume, index) => {
            const health = getMockHealthData(index);
            const insights = [
              "2 improvements pending",
              "Score improved +4 this week",
              "Add 1 measurable achievement",
              "High keyword match found",
              "Summary too lengthy"
            ];
            const insightText = insights[index % insights.length];

            return (
              <div
                key={resume.id || index}
                className="group relative flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 snap-center overflow-hidden flex flex-col"
              >
                {/* Top Colored Bar matched to status */}
                <div className={`h-1.5 w-full ${health.color.replace('text-', 'bg-').split(' ')[0]}`}></div>

                <div className="p-5 flex-grow flex flex-col">
                  {/* Top Row: Icon & Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                      <LuFileText className="text-lg" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${health.color}`}>
                      {health.label}
                    </span>
                  </div>

                  {/* Title & Date */}
                  <h4 className="font-bold text-slate-800 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                    {resume.title || resume.name || "Untitled Resume"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-4">
                    <LuClock className="text-slate-400" /> Edited {formatDate(resume.date || resume.updatedAt)}
                  </p>

                  {/* Resume Health Mini Visual */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Health Score</p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${health.ringName.replace('text', 'bg')}`} style={{ width: `${health.progress}%` }}></div>
                      </div>
                    </div>
                    <div className={`text-lg font-black ml-4 ${health.ringName}`}>
                      {health.progress}
                    </div>
                  </div>

                  {/* AI Insight Snippet */}
                  <div className="mt-auto pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <HiSparkles className="text-orange-400" /> {insightText}
                    </p>
                  </div>
                </div>

                {/* Hover Action Overlay (Slides up from bottom) */}
                <div className="absolute left-0 right-0 bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex flex-col items-center justify-center gap-1">
                    <LuPenTool className="text-sm" /> Edit
                  </button>
                  <button className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex flex-col items-center justify-center gap-1">
                    <HiOutlineDocumentSearch className="text-sm" /> ATS Check
                  </button>
                  <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex flex-col items-center justify-center gap-1">
                    <LuDownload className="text-sm" /> PDF
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="w-full text-center py-12 px-4 flex items-center justify-center flex-col border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl mx-2">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full"></div>
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-blue-500 relative z-10">
                <LuTarget className="text-4xl" />
              </div>
            </div>
            <h4 className="text-slate-800 font-bold text-xl mb-2">No active resumes yet</h4>
            <p className="text-slate-500 text-sm max-w-[280px] mb-6 leading-relaxed">
              Create your first AI-optimized resume and unlock personalized health scores and actionable insights.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all hover:-translate-y-0.5">
              Create Your First Resume
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default RecentResumes;