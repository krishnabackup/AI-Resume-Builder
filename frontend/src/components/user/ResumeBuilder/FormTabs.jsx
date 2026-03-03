import {
  User,
  Briefcase,
  GraduationCap,
  Zap,
  FolderKanban,
  Award,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRef } from "react";

/* ===== TABS (SINGLE SOURCE OF TRUTH) ===== */
const tabs = [
  { id: "personal", label: "Personal", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certs", label: "Certifications", icon: Award },
  { id: "skills", label: "Skills", icon: Zap },
];

export default function FormTabs({
  activeSection,
  setActiveSection,
  showPreview = false,
  onTogglePreview,
}) {
  const tabsRef = useRef(null);
  const currentIdx = tabs.findIndex((tab) => tab.id === activeSection);
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 gap-2">
      {/* TABS */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={tabsRef}
          className="flex justify-between gap-2 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;
            return (
              active && (
                <div
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className="flex items-center gap-2 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-black select-none md:px-4 px-2"
                >
                  <Icon size={16} />
                  {label}
                </div>
              )
            );
          })}
          {/* step progress */}
          <div className="flex flex-col items-center text-xs flex-wrap md:gap-2 gap-1 md:ml-4 ml-2 md:mr-0 mr-2 w-24">
            {/* Steps */}
            <div className="text-[0.67rem] md:text-xs">
              step {currentIdx + 1} of 6
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-lg">
              <div
                className="h-full bg-blue-400 rounded-lg transition-all duration-200"
                style={{ width: `${((currentIdx + 1) / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile preview toggle (matches CV & Cover Letter) */}
      <button
        onClick={onTogglePreview}
        aria-label={showPreview ? "Hide resume preview" : "Show resume preview"}
        title={showPreview ? "Hide preview" : "Preview Resume"}
        className={`
          lg:hidden
          flex-shrink-0
          flex items-center gap-1.5
          px-3 py-2
          rounded-lg
          text-xs font-semibold
          border transition-all duration-200
          ${
            showPreview
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
          }
        `}
      >
        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
        <span className="hidden sm:inline">
          {showPreview ? "Hide" : "Preview"}
        </span>
      </button>
    </div>
  );
}
