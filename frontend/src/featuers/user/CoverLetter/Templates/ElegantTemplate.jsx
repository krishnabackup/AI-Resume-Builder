import React, { memo, useMemo } from "react";

// Move static functions outside
const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith('http') ? url : `https://${url}`;
};

const ElegantTemplate = memo(({ formData }) => {
  const {
    fullName, email, phone, address, linkedin, website, github, extraLinks,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  const exportDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  const socialLinks = useMemo(() => {
    const links = [];
    if (email) links.push(<span key="email">{email}</span>);
    if (phone) links.push(<span key="phone">{phone}</span>);
    if (linkedin) {
      links.push(
        <span key="linkedin" className="truncate max-w-[150px]">
          <a href={formatUrl(linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            LinkedIn
          </a>
        </span>
      );
    }
    if (website) {
      links.push(
        <span key="website" className="truncate max-w-[150px]">
          <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Website
          </a>
        </span>
      );
    }
    if (github) {
      links.push(
        <span key="github" className="truncate max-w-[150px]">
          <a href={formatUrl(github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            GitHub
          </a>
        </span>
      );
    }
    if (extraLinks) {
      extraLinks.forEach((link, index) => {
        if (link.label && link.url) {
          links.push(
            <span key={`extra-${index}`} className="truncate max-w-[150px]">
              <a href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {link.label}
              </a>
            </span>
          );
        }
      });
    }
    return links;
  }, [email, phone, linkedin, website, github, extraLinks]);

  return (
    <div className="p-16 bg-[#fffcf5] text-stone-800 font-serif leading-loose min-h-[297mm] shadow-inner flex flex-col antialiased">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>

      {/* Elegant Header */}
      <header className="border-b-[3px] border-double border-stone-300 pb-12 mb-16 relative">
        <h1 className="text-5xl font-light tracking-widest text-stone-900 mb-6 text-center italic">{fullName || "your name"}</h1>
        <div className="flex justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 flex-wrap">
           {socialLinks}
        </div>
        {address && <div className="text-center mt-3 text-[10px] text-stone-300 uppercase tracking-widest">{address}</div>}
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
           {openingParagraph && <p>{openingParagraph}</p>}
           {bodyParagraph1 && <p>{bodyParagraph1}</p>}
           {bodyParagraph2 && <p>{bodyParagraph2}</p>}
           {closingParagraph && <p>{closingParagraph}</p>}
        </div>

        <div className="mt-auto pt-24 pb-8 flex flex-col items-end">
           <p className="italic text-stone-400 mb-6 text-sm">{customSalutation || salutation || "Most Respectfully"},</p>
           <p className="text-3xl font-light italic text-stone-900">{fullName}</p>
           <div className="h-px w-32 bg-stone-200 mt-4"></div>
        </div>
      </div>
    </div>
  );
});

ElegantTemplate.displayName = "ElegantTemplate";

export default ElegantTemplate;
