import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HealthScoreCard = React.memo(({ avgAtsScore, healthStatusLabel, healthStatusColor, healthStrokeColor, feedbackMessage }) => {
  const navigate = useNavigate();
  
  const circleRadius = 55;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (avgAtsScore / 100) * circleCircumference;

  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 border border-slate-700">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="flex-1 z-10 w-full text-center sm:text-left">
        <span className="inline-block px-3 py-1 bg-slate-800/80 border border-slate-700 text-blue-300 text-xs font-bold tracking-wider rounded-full mb-4 uppercase">
          Overall Resume Health
        </span>
        <h2 className={`text-3xl sm:text-4xl font-extrabold mb-2 ${healthStatusColor}`}>
          {healthStatusLabel}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
          {feedbackMessage}
        </p>

        <div className="mt-8">
          <button
            onClick={() => navigate("/user/ats-checker")}
            className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 sm:w-auto w-full mx-auto sm:mx-0"
          >
            Improve Resume <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Circular Progress Indicator */}
      <div className="relative flex items-center justify-center z-10 shrink-0">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            stroke={healthStrokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">
            {avgAtsScore}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Score
          </span>
        </div>
      </div>
    </div>
  );
});

HealthScoreCard.displayName = 'HealthScoreCard';

export default HealthScoreCard;
