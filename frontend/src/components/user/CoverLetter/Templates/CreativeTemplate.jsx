import React from "react";

const CreativeTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white min-h-[297mm] p-0 font-sans border-[16px] border-emerald-500 overflow-hidden flex flex-col">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>
      
      <div className="bg-emerald-500 p-12 text-white">
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none select-none">
          {fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold opacity-90 uppercase tracking-widest">
          <span>{email}</span>
          <span>{phone}</span>
          <span className="truncate max-w-[200px]">{linkedin}</span>
          <span className="truncate max-w-[200px]">{address}</span>
        </div>
      </div>

      <div className="px-12 pt-12 pb-16 flex-1 bg-white">
        <div className="flex flex-col sm:flex-row justify-between mb-12 gap-8">
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex-1 relative">
            <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Attention</div>
            <p className="text-xl font-black text-slate-900">{recipientName}</p>
            <p className="text-sm font-bold text-slate-400">{recipientTitle}</p>
            <p className="mt-4 text-emerald-600 font-black uppercase text-xs">{companyName}</p>
            <p className="text-[10px] text-slate-400 whitespace-pre-line leading-relaxed">{companyAddress}</p>
          </div>
          
          <div className="text-right sm:w-48 pt-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Date Posted</p>
            <p className="text-sm font-black text-slate-900">{exportDate}</p>
            {jobReference && <div className="mt-4 inline-block bg-slate-100 px-3 py-1 rounded text-[10px] font-bold">Ref: {jobReference}</div>}
          </div>
        </div>

        {jobTitle && (
          <div className="mb-10 inline-flex bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest shadow-sm gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
            Applying for: {jobTitle}
          </div>
        )}

        <div className="space-y-8 text-lg font-medium text-slate-700 max-w-2xl template-content">
          <p className="text-2xl font-black text-slate-900 border-l-8 border-emerald-500 pl-4 py-2 bg-slate-50/50 rounded-r-lg">
            Dear {recipientName || "Hiring Manager"},
          </p>
          
          {(jobSummary || jobDescription) && (
             <div className="text-xs border-2 border-dashed border-emerald-200 p-6 rounded-3xl italic bg-emerald-50/20 text-slate-500 leading-relaxed shadow-inner">
                {jobSummary && <p className="mb-2"><strong>Context:</strong> {jobSummary}</p>}
                {jobDescription && <p><strong>Key Requirements:</strong> {jobDescription}</p>}
             </div>
          )}

          <div className="space-y-6 text-[16px] antialiased">
            <p>{openingParagraph}</p>
            <div className="space-y-4 text-slate-600">
               <p>{bodyParagraph1}</p>
               <p>{bodyParagraph2}</p>
               <p>{closingParagraph}</p>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-end">
          <div className="text-right">
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 italic leading-none">{customSalutation || salutation || "Best Regards"},</p>
            <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter decoration-emerald-500 underline decoration-[10px] underline-offset-4">{fullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
