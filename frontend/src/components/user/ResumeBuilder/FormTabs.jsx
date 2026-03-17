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
import { useRef, useEffect } from "react";

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

  // Auto-scroll the active tab into view whenever it changes
  useEffect(() => {
    if (tabsRef.current) {
      const activeTabEl = tabsRef.current.querySelector(
        `[data-testid="tab-${activeSection}"]`
      );
      if (activeTabEl) {
        activeTabEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeSection]);
  return (
    <div className="bg-white rounded-t-2xl px-4 py-3 border-b border-slate-100 flex flex-col gap-3">
      {/* Top Row: Tabs + Mobile Preview */}
      <div className="flex items-center justify-between gap-4">
        {/* TABS */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto scroll-smooth pb-1 pr-4"
            style={{
              scrollbarWidth: "none", // Hide scrollbar for cleaner look
              msOverflowStyle: "none"
            }}
          >
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <div
                  key={id}
                  data-testid={`tab-${id}`}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all select-none cursor-pointer ${active
                    ? "text-blue-700 bg-blue-50 shadow-sm border border-blue-100"
                    : "text-slate-500 border border-transparent hover:text-slate-800 hover:bg-slate-50"
                    }`}
                >
                  <Icon size={16} className={active ? "text-blue-600" : "text-slate-400"} />
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile preview toggle */}
        <button
          onClick={onTogglePreview}
          aria-label={showPreview ? "Hide resume preview" : "Show resume preview"}
          title={showPreview ? "Hide preview" : "Preview Resume"}
          className={`
            lg:hidden
            flex-shrink-0
            flex items-center gap-1.5
            px-3 py-1.5
            rounded-lg
            text-sm font-medium
            border transition-all duration-200
            ${showPreview
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-sm"
            }
          `}
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="hidden sm:inline">
            {showPreview ? "Hide" : "Preview"}
          </span>
        </button>
      </div>

      {/* Bottom Row: Step Progress */}
      <div className="flex items-center gap-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 whitespace-nowrap">
          Step {currentIdx + 1} of 6
        </div>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIdx + 1) / 6) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
