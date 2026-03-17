import React from "react";

const TechTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  return (
    <div className="w-full bg-[#0f172a] p-16 text-slate-300 font-mono leading-relaxed min-h-[297mm] flex flex-col relative overflow-hidden">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
        .code-style { color: #38bdf8; }
      `}</style>
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>

      {/* Header Section */}
      <div className="relative z-10 border-l border-blue-500/30 pl-8 mb-20">
        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">./user_profile</div>
        <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-4 leading-none">
          {fullName || "DEV_NAME"}
        </h1>
        <div className="grid grid-cols-2 gap-4 text-[10px] opacity-60 max-w-md">
          <div className="flex items-center gap-2"><span className="code-style">email:</span> {email}</div>
          <div className="flex items-center gap-2"><span className="code-style">phone:</span> {phone}</div>
          <div className="flex items-center gap-2 underline decoration-blue-500/20"><span className="code-style">link:</span> {linkedin}</div>
          <div className="flex items-center gap-2 italic"><span className="code-style">addr:</span> {address}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-12 relative z-10">
        <div className="flex items-start gap-12">
           <div className="w-1/3 space-y-6">
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Target Node</div>
                <p className="text-white font-bold">{companyName}</p>
                <p className="text-xs text-blue-400 underline decoration-blue-400/20">{recipientName}</p>
                <p className="text-[10px] opacity-40 italic whitespace-pre-line">{companyAddress}</p>
              </div>
              <div className="h-px bg-slate-800 w-full"></div>
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Job Class</div>
                <p className="text-xs font-bold text-white uppercase tracking-tight">{jobTitle}</p>
                {jobReference && <p className="text-[9px] opacity-30 italic">UID: {jobReference}</p>}
              </div>
           </div>

           <div className="w-2/3 space-y-8 template-content">
              <div className="text-xs font-bold p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                 {/* Job summary acts like a docstring */}
                 <p className="text-slate-500 italic">/**</p>
                 <p className="text-slate-500 italic text-[10px] pl-4">* {jobSummary || "Seeking a role that utilizes core engineering principles..."}</p>
                 <p className="text-slate-500 italic">*/</p>
              </div>

              <div className="space-y-6 text-sm antialiased">
                <p className="text-blue-400 font-bold tracking-widest uppercase text-[10px]">class CoverLetter extends Professional {'{'}</p>
                <div className="pl-6 space-y-6 border-l border-slate-800">
                  <p className="text-white font-medium">{openingParagraph}</p>
                  <p>{bodyParagraph1}</p>
                  <p>{bodyParagraph2}</p>
                  <p>{closingParagraph}</p>
                </div>
                <p className="text-blue-400 font-bold tracking-widest uppercase text-[10px]">{'}'}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="mt-20 relative z-10 pt-10 border-t border-slate-800 flex justify-between items-end">
        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.4em]">system.commit(salutation: "{customSalutation || salutation || "Sincerely"}")</div>
        <div className="text-right">
           <p className="text-[9px] font-bold text-blue-500 uppercase mb-2 tracking-widest">End_of_Transmission</p>
           <p className="text-2xl font-black text-white italic tracking-tighter underline decoration-blue-500/50 decoration-[6px] underline-offset-4">{fullName}</p>
        </div>
      </div>
    </div>
  );
};

export default TechTemplate;
