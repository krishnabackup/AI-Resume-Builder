import React from "react";

const ProfessionalTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  return (
    <div className="w-full bg-white p-12 text-slate-900 font-serif leading-relaxed min-h-[297mm]">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>
      
      {/* Header */}
      <div className="text-center mb-10 border-b-2 border-slate-900 pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">{fullName || "Your Name"}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {linkedin && <span>• {linkedin}</span>}
        </div>
        {address && <p className="text-sm text-slate-500 mt-1">{address}</p>}
      </div>

      {/* Date & Ref */}
      <div className="flex justify-between mb-8 text-sm italic text-slate-500">
        <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        {jobReference && <div>Ref: {jobReference}</div>}
      </div>

      {/* Recipient Information */}
      <div className="mb-10 text-sm">
        <p className="font-bold text-base">{recipientName || "Hiring Manager"}</p>
        <p>{recipientTitle}</p>
        <p className="font-bold">{companyName}</p>
        <p className="whitespace-pre-line">{companyAddress}</p>
      </div>

      {/* Subject Line */}
      <div className="mb-8 border-y border-slate-100 py-3">
        <p className="font-bold uppercase tracking-tight text-[10px] text-slate-400 mb-1">Subject</p>
        <h2 className="text-lg font-bold text-slate-900 leading-tight">
          Application for {jobTitle || "the position"}
        </h2>
        <div className="flex flex-col gap-1 mt-2">
            {jobSummary && <p className="text-xs text-slate-500 italic">Summary: {jobSummary}</p>}
            {jobDescription && <p className="text-xs text-slate-500 italic">Focus: {jobDescription}</p>}
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-6 text-[15px] template-content">
        <p className="font-bold">Dear {recipientName || "Hiring Manager"},</p>
        <p>{openingParagraph || "I am writing to express my interest in the position..."}</p>
        <p>{bodyParagraph1}</p>
        <p>{bodyParagraph2}</p>
        <p>{closingParagraph}</p>
      </div>

      {/* Closing */}
      <div className="mt-16 pt-8 border-t border-slate-100">
        <p className="mb-2 italic text-slate-600">{customSalutation || salutation || "Sincerely"},</p>
        <p className="text-xl font-bold">{fullName || "Your Name"}</p>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
