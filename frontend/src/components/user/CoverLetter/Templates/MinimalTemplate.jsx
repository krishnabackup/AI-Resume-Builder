import React from "react";

const MinimalTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-16 bg-white text-slate-700 font-sans leading-relaxed min-h-[297mm] flex flex-col antialiased">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>

      {/* Header */}
      <div className="mb-20">
        <h1 className="text-4xl font-light text-slate-900 tracking-tight lowercase mb-4">{fullName || "your name"}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 font-medium">
          <span>{email}</span>
          <span>{phone}</span>
          <span className="truncate max-w-[150px]">{linkedin}</span>
          <span className="truncate max-w-[150px] italic">{address}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 max-w-2xl">
        <div className="mb-12 text-xs space-y-1">
          <p className="text-slate-300 font-bold uppercase tracking-widest mb-4">{exportDate}</p>
          <p className="font-bold text-slate-900">{recipientName}</p>
          <p>{recipientTitle}</p>
          <p className="font-bold text-slate-500">{companyName}</p>
          <p className="text-slate-400 whitespace-pre-line leading-none mt-2">{companyAddress}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2 uppercase text-[10px] tracking-[0.2em] text-slate-300">Subject</h2>
          <p className="text-lg font-medium text-slate-800 underline decoration-slate-100 decoration-4 underline-offset-4">Application for {jobTitle}</p>
          {jobReference && <p className="text-[10px] text-slate-300 mt-2 font-bold italic">Ref: {jobReference}</p>}
        </div>

        <div className="space-y-8 text-[15px] template-content">
          <p className="text-slate-900 font-bold">Dear {recipientName || "Hiring Manager"},</p>
          <div className="space-y-6">
            <p className="first-letter:text-2xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-1">{openingParagraph}</p>
            <p>{bodyParagraph1}</p>
            <p>{bodyParagraph2}</p>
            <p>{closingParagraph}</p>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-xs text-slate-300 uppercase tracking-widest mb-4 italic leading-none">{customSalutation || salutation || "Sincerely"}</p>
          <p className="text-2xl font-light text-slate-900 tracking-tighter lowercase decoration-slate-200 underline decoration-2">{fullName}</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
