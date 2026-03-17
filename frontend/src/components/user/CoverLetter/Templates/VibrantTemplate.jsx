import React from "react";

const VibrantTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  return (
    <div className="w-full bg-[#fff] min-h-[297mm] flex font-sans leading-relaxed relative overflow-hidden">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>
      
      {/* Bold Geometric Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-48 bg-orange-400 -skew-y-12 origin-top-right transform translate-y-[-50%] group-hover:translate-y-[-40%] transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-32 bg-purple-600 skew-y-12 origin-bottom-left transform translate-y-[50%]"></div>

      <div className="relative z-10 w-full p-20 flex flex-col">
        <header className="mb-20">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 decoration-orange-400 decoration-8 underline-offset-[12px] underline">
            {fullName || "Hello World"}
          </h1>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             <div className="bg-slate-900 text-white px-3 py-1 rounded-sm">{email}</div>
             <div className="py-1 border-b-2 border-slate-100">{phone}</div>
             <div className="py-1 border-b-2 border-slate-100 italic">{linkedin}</div>
          </div>
        </header>

        <main className="flex gap-16 flex-1">
          <div className="w-2/3 space-y-10 template-content">
             <div className="space-y-6 text-xl font-bold text-slate-800 antialiased">
                <p className="text-4xl text-purple-600 font-black leading-none italic mb-4">Dear {recipientName || "Hiring Lead"},</p>
                <div className="space-y-8 text-lg leading-relaxed font-medium text-slate-600">
                  <p className="text-slate-900 text-2xl font-black border-l-8 border-orange-400 pl-6 py-2 bg-orange-50/30">{openingParagraph}</p>
                  <p>{bodyParagraph1}</p>
                  <p>{bodyParagraph2}</p>
                  <p>{closingParagraph}</p>
                </div>
             </div>
          </div>

          <aside className="w-1/3 space-y-12 mt-4">
             <div className="p-8 bg-slate-50 border-4 border-slate-900 rounded-[2rem] shadow-[12px_12px_0_0_rgba(75,85,99,0.1)]">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6">Application Context</div>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-slate-300 uppercase mb-1">Company</p>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{companyName}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-300 uppercase mb-1">Role</p>
                      <p className="text-sm font-black text-purple-600 uppercase tracking-tight">{jobTitle}</p>
                   </div>
                   {jobReference && <div className="text-[10px] italic text-slate-400"># {jobReference}</div>}
                </div>
             </div>

             <div className="space-y-4 px-4 text-xs italic text-slate-400 leading-relaxed font-medium">
                {jobSummary && (
                  <p><strong className="text-slate-900 font-bold not-italic">Quick summary:</strong> {jobSummary}</p>
                )}
                {jobDescription && (
                  <p><strong className="text-slate-900 font-bold not-italic">Focus areas:</strong> {jobDescription}</p>
                )}
             </div>
          </aside>
        </main>

        <footer className="mt-20 flex justify-between items-end border-t-2 border-slate-50 pt-10">
           <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Created via AI Builder</div>
           <div className="text-right">
              <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-4 italic leading-none underline decoration-2">{customSalutation || salutation || "Best Wishes"}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{fullName}</p>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default VibrantTemplate;
