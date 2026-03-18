import React from "react";

const ElegantTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-16 bg-[#fffcf5] text-stone-800 font-serif leading-loose min-h-[297mm] shadow-inner flex flex-col antialiased">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>

      {/* Elegant Header */}
      <header className="border-b-[3px] border-double border-stone-300 pb-12 mb-16 relative">
        <h1 className="text-5xl font-light tracking-widest text-stone-900 mb-6 text-center italic">{fullName || "your name"}</h1>
        <div className="flex justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
           <span>{email}</span>
           <span>{phone}</span>
           <span className="truncate max-w-[150px]">{linkedin}</span>
        </div>
        <div className="text-center mt-3 text-[10px] text-stone-300 uppercase tracking-widest">{address}</div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#fffcf5] px-8 text-stone-300">
           <span className="text-lg">✧</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-16 text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">
           <span>Date: {exportDate}</span>
           {jobReference && <span>Ref: {jobReference}</span>}
        </div>

        <div className="mb-20 space-y-2">
           <h4 className="text-[9px] font-bold uppercase text-stone-300 tracking-[0.4em] mb-4">To the attention of</h4>
           <div className="space-y-1">
             <p className="text-xl font-medium text-stone-900 italic underline-offset-8 underline decoration-stone-200 decoration-1">{recipientName}</p>
             <p className="text-xs text-stone-500 uppercase tracking-widest pt-2">{recipientTitle}</p>
             <p className="text-stone-900 font-bold uppercase tracking-tight pt-4 leading-none">{companyName}</p>
             <p className="text-[10px] text-stone-400 whitespace-pre-line leading-relaxed italic">{companyAddress}</p>
           </div>
        </div>

        <div className="space-y-10 text-[16px] text-stone-700 indent-8 template-content">
           <div className="mb-10 indent-0 border-l border-stone-100 pl-8">
              <h2 className="text-[9px] font-bold uppercase text-stone-300 tracking-[0.3em] mb-4">RE: Selection Opportunity</h2>
              <p className="text-lg font-medium italic text-stone-900">{jobTitle}</p>
              <div className="mt-2 space-y-1 opacity-60">
                {jobSummary && <p className="text-xs italic">{jobSummary}</p>}
                {jobDescription && <p className="text-[10px] uppercase font-bold tracking-widest italic">{jobDescription}</p>}
              </div>
           </div>

           <p className="indent-0 text-stone-900 font-bold italic text-lg decoration-stone-100 underline decoration-8 underline-offset-[-2px]">Dear {recipientName || "Hiring Manager"},</p>
           <p>{openingParagraph}</p>
           <p>{bodyParagraph1}</p>
           <p>{bodyParagraph2}</p>
           <p>{closingParagraph}</p>
        </div>

        <div className="mt-auto pt-24 pb-8 flex flex-col items-end">
           <p className="italic text-stone-400 mb-6 text-sm">{customSalutation || salutation || "Most Respectfully"},</p>
           <p className="text-3xl font-light italic text-stone-900">{fullName}</p>
           <div className="h-px w-32 bg-stone-200 mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
