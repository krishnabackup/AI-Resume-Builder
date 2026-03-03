import React, { useState, useMemo } from 'react';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { FiTrendingUp, FiChevronDown, FiChevronUp, FiCheck, FiFileText, FiCheckCircle, FiX } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

const MOCK_ACTIONS = [
    {
        id: 1,
        resumeId: "res-1",
        resumeTitle: "Software Engineer Template",
        title: "Quantify Experience",
        description: "Add more numbers and metrics to your recent role to increase impact.",
        suggestedFix: "Change 'Improved performance' to 'Improved performance by 35% over 6 months'.",
        priority: "High",
        impactScore: "+8 Score",
        section: "Experience",
        status: "open",
    },
    {
        id: 2,
        resumeId: "res-2",
        resumeTitle: "Product Manager - Startup",
        title: "Condense Summary",
        description: "Your summary is too long. Recruiters prefer 3-4 concise lines.",
        suggestedFix: "Remove the second sentence and focus only on your top 3 core competencies.",
        priority: "Medium",
        impactScore: "+5 Score",
        section: "Summary",
        status: "open",
    },
    {
        id: 3,
        resumeId: "res-1",
        resumeTitle: "Software Engineer Template",
        title: "Add Technical Skills",
        description: "You mentioned React in your experience but it's missing from the Skills section.",
        suggestedFix: "Add 'React.js' and 'Tailwind CSS' to your Skills area.",
        priority: "High",
        impactScore: "+10 Score",
        section: "Skills",
        status: "open",
    },
    {
        id: 4,
        resumeId: "res-3",
        resumeTitle: "Data Scientist",
        title: "Fix Formatting",
        description: "Inconsistent margins detected in the education section.",
        suggestedFix: "Align the dates for your University degree to the right margin.",
        priority: "Low",
        impactScore: "+2 Score",
        section: "Formatting",
        status: "completed",
    }
];

const ActionCenter = () => {
    const [actions, setActions] = useState(MOCK_ACTIONS);
    const [selectedResume, setSelectedResume] = useState("all");
    const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'high', 'completed'
    const [expandedId, setExpandedId] = useState(null);
    const [modalData, setModalData] = useState(null);

    // Derived data for dropdown options
    const uniqueResumes = useMemo(() => {
        const resMap = new Map();
        actions.forEach(a => {
            if (!resMap.has(a.resumeId)) {
                resMap.set(a.resumeId, a.resumeTitle);
            }
        });
        return Array.from(resMap.entries()).map(([id, title]) => ({ id, title }));
    }, [actions]);

    const filteredActions = useMemo(() => {
        return actions.filter(action => {
            // Filter by resume
            if (selectedResume !== "all" && action.resumeId !== selectedResume) return false;

            // Filter by chips
            if (activeFilter === "high" && (action.priority !== "High" || action.status !== "open")) return false;
            if (activeFilter === "completed" && action.status !== "completed") return false;
            if (activeFilter === "all" && action.status !== "open") return false;

            return true;
        });
    }, [actions, selectedResume, activeFilter]);

    const toggleDone = (e, id) => {
        e.stopPropagation();
        setActions(prev => prev.map(a =>
            a.id === id ? { ...a, status: a.status === 'open' ? 'completed' : 'open' } : a
        ));
    };

    const handleFixNow = (e, action) => {
        e.stopPropagation();
        setModalData(action);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full w-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-50 text-orange-500 p-2.5 rounded-xl shadow-[0_2px_10px_-3px_rgba(249,115,22,0.3)] border border-orange-100/50">
                        <HiOutlineLightningBolt className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI Optimization Inbox</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Smart suggestions to boost your score</p>
                    </div>
                </div>

                <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer w-full md:w-auto hover:bg-slate-100 transition-colors"
                >
                    <option value="all">Global (All Resumes)</option>
                    {uniqueResumes.map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                </select>
            </div>

            {/* Filters Area */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
                {[
                    { id: 'all', label: 'To-Do' },
                    { id: 'high', label: 'High Priority' },
                    { id: 'completed', label: 'Completed' }
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeFilter === filter.id
                                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/10'
                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* List Area */}
            <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {filteredActions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 h-48">
                        <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100 mb-4">
                            <FiCheckCircle className="text-3xl text-emerald-500" />
                        </div>
                        <h4 className="text-slate-800 font-bold mb-1">You're all caught up!</h4>
                        <p className="text-slate-500 text-sm max-w-[250px] leading-relaxed">
                            {activeFilter === 'completed'
                                ? "You haven't completed any actions yet."
                                : "Create your first resume or scan again to get AI suggestions."}
                        </p>
                    </div>
                ) : (
                    filteredActions.map(action => (
                        <div
                            key={action.id}
                            className={`group flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${action.status === 'completed'
                                    ? 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-[0_4px_20px_-4px_rgba(59,130,246,0.15)]'
                                }`}
                            onClick={() => setExpandedId(expandedId === action.id ? null : action.id)}
                        >
                            <div className="flex justify-between items-start gap-3">
                                {/* Checkbox */}
                                <div className="mt-0.5">
                                    <button
                                        onClick={(e) => toggleDone(e, action.id)}
                                        className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all shadow-sm ${action.status === 'completed'
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'border-slate-300 bg-slate-50 hover:border-blue-500 text-transparent hover:text-blue-200'
                                            }`}
                                    >
                                        <FiCheck className="text-xs" strokeWidth={3} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                        {/* Priority */}
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${action.priority === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                action.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    'bg-slate-50 text-slate-600 border border-slate-200'
                                            }`}>
                                            {action.priority}
                                        </span>

                                        {/* Section */}
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                                            {action.section}
                                        </span>

                                        {/* Impact */}
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                                            <FiTrendingUp strokeWidth={2.5} /> {action.impactScore}
                                        </span>
                                    </div>

                                    <h4 className={`text-sm font-bold mb-1 transition-colors truncate pr-2 ${action.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                        {action.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                                        {action.description}
                                    </p>

                                    {/* Resume Badge (Only if "Global" is selected) */}
                                    {selectedResume === 'all' && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/60">
                                            <FiFileText className="text-slate-400" /> {action.resumeTitle}
                                        </div>
                                    )}
                                </div>

                                {/* Chevron */}
                                <div className={`text-slate-400 p-1 rounded-full group-hover:bg-slate-100 group-hover:text-slate-700 transition-all ${expandedId === action.id ? 'bg-slate-100 text-slate-700' : ''}`}>
                                    {expandedId === action.id ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === action.id && (
                                <div className="mt-4 pl-8 pr-2 pb-1">
                                    <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 rounded-xl p-3 border border-blue-100/60 mb-3 shadow-sm">
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            <span className="font-bold text-blue-700 block mb-1">AI Suggestion:</span>
                                            {action.suggestedFix}
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={(e) => toggleDone(e, action.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                                        >
                                            {action.status === 'completed' ? 'Mark Undone' : 'Mark Done'}
                                        </button>
                                        {action.status !== 'completed' && (
                                            <button
                                                onClick={(e) => handleFixNow(e, action)}
                                                className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 active:scale-95"
                                            >
                                                Fix Now <FaArrowRight className="text-[10px]" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Fix Now */}
            {modalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setModalData(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <div className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
                                    <HiOutlineLightningBolt className="text-lg" />
                                </div>
                                Apply AI Optimization
                            </h3>
                            <button onClick={() => setModalData(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors shadow-sm border border-slate-200">
                                <FiX className="text-lg" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Section</span>
                                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                                    {modalData.section}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200/50 rounded-xl p-5 mb-6 relative shadow-inner">
                                <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                                    Recommended Change
                                </div>
                                <p className="text-sm text-slate-700 mt-1 font-medium leading-relaxed">{modalData.suggestedFix}</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setModalData(null)} className="flex-1 px-4 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                                    Not Now
                                </button>
                                <button onClick={() => {
                                    alert(`Navigating to /user/resume-editor/${modalData.resumeId}?focus=${modalData.section}`);
                                    setModalData(null);
                                }} className="flex-1 px-4 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                    Open Editor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom scrollbar styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default ActionCenter;
