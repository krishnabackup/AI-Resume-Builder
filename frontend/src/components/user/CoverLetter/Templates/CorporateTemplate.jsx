import React from "react";

const CorporateTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  return (
    <div className="w-full bg-white p-16 text-gray-800 font-sans leading-snug min-h-[297mm] flex flex-col border-t-[12px] border-blue-900">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tighter uppercase mb-2">{fullName || "Your Name"}</h1>
          <p className="text-sm font-bold text-gray-400 tracking-[0.2em] uppercase">{jobTitle || "Professional Title"}</p>
        </div>
        <div className="text-right text-xs space-y-1 font-medium text-gray-500">
          <p>{email}</p>
          <p>{phone}</p>
          <p className="truncate max-w-[200px]">{linkedin}</p>
          <p className="whitespace-pre-line underline decoration-blue-100">{address}</p>
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-12 flex gap-12">
        <div className="w-px bg-gray-100 h-24"></div>
        <div>
          <p className="text-[10px] font-black uppercase text-blue-900/30 tracking-widest mb-4 italic">Deliver To</p>
          <p className="text-lg font-bold text-gray-900">{recipientName}</p>
          <p className="text-sm text-gray-500 italic mb-2">{recipientTitle}</p>
          <p className="text-sm font-black text-blue-900 uppercase tracking-tight">{companyName}</p>
          <p className="text-xs text-gray-400 whitespace-pre-line mt-1">{companyAddress}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-10">
        <div className="flex justify-between items-end border-b border-gray-50 pb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.1em] text-gray-900">Letter of Intent</h2>
          <span className="text-[10px] font-bold text-gray-300">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div className="space-y-6 text-[15px] leading-relaxed text-gray-700 template-content">
          <p className="font-black text-gray-900">Dear {recipientName || "Hiring Manager"},</p>
          <p className="font-medium text-gray-800 leading-normal">{openingParagraph}</p>
          <div className="space-y-4">
            <p>{bodyParagraph1}</p>
            <p>{bodyParagraph2}</p>
            <p>{closingParagraph}</p>
          </div>
        </div>

        {(jobSummary || jobDescription) && (
          <div className="p-6 bg-slate-50 border-l-4 border-blue-900 rounded-r-xl">
             <h4 className="text-[9px] font-bold uppercase text-blue-900/40 tracking-widest mb-2">Subject Context</h4>
             <p className="text-xs font-bold text-gray-900 mb-1">{jobTitle}</p>
             {jobReference && <p className="text-[10px] text-gray-400 italic mb-2">Ref: {jobReference}</p>}
             <p className="text-xs text-gray-500 leading-relaxed italic">{jobSummary || jobDescription}</p>
          </div>
        )}
      </div>

      {/* Signature */}
      <div className="mt-16 pt-12 border-t border-gray-50">
        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">{customSalutation || salutation || "Sincerely"}</p>
        <p className="text-2xl font-black text-blue-900 tracking-tighter uppercase underline decoration-gray-100 decoration-8 underline-offset-4">{fullName}</p>
      </div>
    </div>
  );
};

export default CorporateTemplate;
