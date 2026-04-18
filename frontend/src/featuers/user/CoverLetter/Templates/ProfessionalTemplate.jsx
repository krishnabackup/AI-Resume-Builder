import React, { memo, useMemo } from "react";

// Move static functions outside
const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith('http') ? url : `https://${url}`;
};

const ProfessionalTemplate = memo(({ formData }) => {
  const {
    fullName, email, phone, address, linkedin, website, github, extraLinks,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  const memoizedExtraLinks = useMemo(() => {
    return extraLinks?.map((link, index) => {
      if (!link.label || !link.url) return null;
      return (
        <span key={index}>
          • <a href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {link.label}
          </a>
        </span>
      );
    });
  }, [extraLinks]);

  const socialLinks = useMemo(() => {
    const links = [];
    if (email) links.push(<span key="email">{email}</span>);
    if (phone) links.push(<span key="phone">• {phone}</span>);
    if (linkedin) {
      links.push(
        <span key="linkedin">
          • <a href={formatUrl(linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>
        </span>
      );
    }
    if (website) {
      links.push(
        <span key="website">
          • <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Website</a>
        </span>
      );
    }
    if (github) {
      links.push(
        <span key="github">
          • <a href={formatUrl(github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub</a>
        </span>
      );
    }
    return links;
  }, [email, phone, linkedin, website, github]);

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
          {socialLinks}
          {memoizedExtraLinks}
        </div>
        {address && <p className="text-sm text-slate-500 mt-1">{address}</p>}
      </div>

      {/* Date & Ref */}
      <div className="flex justify-between mb-8 text-sm italic text-slate-500">
        <div>{formattedDate}</div>
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
        {bodyParagraph1 && <p>{bodyParagraph1}</p>}
        {bodyParagraph2 && <p>{bodyParagraph2}</p>}
        {closingParagraph && <p>{closingParagraph}</p>}
      </div>

      {/* Closing */}
      <div className="mt-16 pt-8 border-t border-slate-100">
        <p className="mb-2 italic text-slate-600">{customSalutation || salutation || "Sincerely"},</p>
        <p className="text-xl font-bold">{fullName || "Your Name"}</p>
      </div>
    </div>
  );
});

ProfessionalTemplate.displayName = "ProfessionalTemplate";

export default ProfessionalTemplate;

