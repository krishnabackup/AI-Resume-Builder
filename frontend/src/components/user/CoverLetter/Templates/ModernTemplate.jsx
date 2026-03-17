import React from "react";

const ModernTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-slate-50 min-h-[297mm] flex font-sans leading-normal">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>
      
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-900 p-10 text-slate-300 space-y-8 flex flex-col">
        <div>
          <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
            {fullName?.split(' ')[0] || "YOUR"}<br/>
            <span className="text-blue-400">{fullName?.split(' ').slice(1).join(' ') || "NAME"}</span>
          </h1>
          <div className="h-1 w-10 bg-blue-500 mt-4"></div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="opacity-60 text-[9px] uppercase font-bold tracking-widest text-slate-400">Contact Details</div>
          <div className="space-y-2">
            <p className="break-all font-medium text-slate-200">{email}</p>
            <p className="font-medium text-slate-200">{phone}</p>
            <p className="whitespace-pre-line leading-relaxed">{address}</p>
            <p className="text-blue-400 font-bold mt-2">{linkedin}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs pt-8 border-t border-slate-800">
          <div className="opacity-60 text-[9px] uppercase font-bold tracking-widest text-slate-400">Target Position</div>
          <div>
            <p className="font-bold text-white text-sm">{jobTitle}</p>
            {jobReference && <p className="text-[10px] opacity-50 mt-1 italic">Ref: {jobReference}</p>}
          </div>
        </div>

        <div className="mt-auto opacity-30 text-[9px] font-bold uppercase tracking-widest">
           Generated via AI Builder
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 bg-white p-12 text-slate-800 flex flex-col">
        <div className="flex justify-between items-start mb-12">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exportDate}</div>
          <div className="text-left w-1/2">
            <div className="text-[9px] font-black uppercase text-slate-300 mb-2">Deliver To</div>
            <p className="font-black text-lg text-slate-900 leading-none">{recipientName}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{recipientTitle}</p>
            <p className="text-xs font-black text-blue-600 mt-2 uppercase tracking-tight">{companyName}</p>
            <p className="text-[10px] whitespace-pre-line text-slate-400 mt-1 italic">{companyAddress}</p>
          </div>
        </div>

        {(jobSummary || jobDescription) && (
          <div className="mb-10 p-5 bg-blue-50/50 rounded-2xl text-xs border border-blue-100 italic text-slate-600 shadow-sm">
            {jobSummary && <p className="mb-2"><strong>Context:</strong> {jobSummary}</p>}
            {jobDescription && <p><strong>Key Objectives:</strong> {jobDescription}</p>}
          </div>
        )}

        <div className="space-y-6 text-[15px] leading-relaxed template-content">
          <h3 className="text-xl font-black text-slate-900">Dear {recipientName || "Hiring Manager"},</h3>
          <p className="font-medium">{openingParagraph || "I'm reaching out regarding my strong interest..."}</p>
          <div className="space-y-4 text-slate-600 antialiased">
            <p>{bodyParagraph1}</p>
            <p>{bodyParagraph2}</p>
            <p>{closingParagraph}</p>
          </div>
        </div>

        <div className="mt-auto pt-16">
          <div className="h-px w-full bg-slate-100 mb-6"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">
            {customSalutation || salutation || "Sincerely"}
          </p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{fullName}</p>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
