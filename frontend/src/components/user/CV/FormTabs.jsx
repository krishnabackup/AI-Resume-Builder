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

const tabs = [
  { id: "personal", label: "Personal", icon: User },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
];

/**
 * FormTabs
 *
 * Props:
 *  activeSection        – current tab id
 *  setActiveSection     – setter
 *  showPreview          – boolean (controlled by parent)
 *  onTogglePreview      – toggle handler (controlled by parent)
 */
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
      {/* ── Active tab label + progress ─────────────────────────────── */}
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-black select-none"
                >
                  <Icon size={16} />
                  {label}
                </div>
              )
            );
          })}

          {/* Step progress */}
          <div className="flex flex-col gap-1 items-center justify-center text-xs flex-shrink-0">
            <div className="text-slate-500">step {currentIdx + 1} of 6</div>
            <div className="w-28 h-2 bg-slate-200 rounded-lg">
              <div
                className="h-full bg-blue-400 rounded-lg transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Preview toggle (visible only on tablets / small screens) ── */}
      {/*
        Show on screens below 'lg' (< 1024px) — adjust breakpoint to match
        wherever your layout splits into side-by-side form + preview.
        The button is hidden on desktop because the preview is already visible.
      */}
      <button
        onClick={onTogglePreview}
        aria-label={showPreview ? "Hide CV preview" : "Show CV preview"}
        title={showPreview ? "Hide preview" : "Preview CV"}
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
