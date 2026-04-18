import React, { memo, useMemo } from "react";

// Move static functions outside
const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith('http') ? url : `https://${url}`;
};

const CleanTemplate = memo(({ formData }) => {
  const {
    fullName, email, phone, address, linkedin, website, github, extraLinks,
    recipientName, recipientTitle, companyName,
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

  const socialLinks = useMemo(() => {
    const links = [];
    if (email) links.push(<span key="email">{email}</span>);
    
    if (phone) {
      links.push(<span key="phone-sep" className="text-stone-200">•</span>);
      links.push(<span key="phone">{phone}</span>);
    }

    const otherLinks = [];
    if (linkedin) {
      otherLinks.push(
        <span key="linkedin">
          <a href={formatUrl(linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            LinkedIn
          </a>
        </span>
      );
    }
    if (website) {
      otherLinks.push(
        <span key="website">
          <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Website
          </a>
        </span>
      );
    }
    if (github) {
      otherLinks.push(
        <span key="github">
          <a href={formatUrl(github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            GitHub
          </a>
        </span>
      );
    }
    if (extraLinks) {
      extraLinks.forEach((link, index) => {
        if (link.label && link.url) {
          otherLinks.push(
            <span key={`extra-${index}`}>
              <a href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {link.label}
              </a>
            </span>
          );
        }
      });
    }

    if (otherLinks.length > 0) {
      links.push(<span key="other-sep" className="text-stone-200">•</span>);
      otherLinks.forEach((link, idx) => {
        links.push(link);
        if (idx < otherLinks.length - 1) {
          links.push(<span key={`sep-${idx}`} className="text-stone-200">•</span>);
        }
      });
    }

    return links;
  }, [email, phone, linkedin, website, github, extraLinks]);

  return (
    <div className="w-full bg-[#fafafa] p-24 text-stone-700 font-sans leading-relaxed min-h-[297mm] flex flex-col items-center">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>

      {/* Ultra Minimalist Header */}
      <div className="w-full max-w-2xl mb-24 border-b border-stone-200 pb-12 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extralight text-stone-900 uppercase tracking-[0.2em] mb-6">{fullName || "Your Name"}</h1>
        <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 flex-wrap justify-center">
           {socialLinks}
        </div>
      </div>

      {/* Body Area */}
      <div className="w-full max-w-2xl flex-1 space-y-16">
        <div className="flex justify-between items-start text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">
           <span className="italic">{formattedDate}</span>
           <div className="text-right flex flex-col gap-1 items-end">
             <span className="text-stone-900 font-black">{companyName}</span>
             <span className="text-[9px] opacity-60 underline decoration-stone-200">{recipientName}</span>
           </div>
        </div>

        <div className="space-y-4">
           <div className="text-[9px] font-black uppercase text-stone-300 tracking-[0.4em] mb-4">Subject</div>
           <h2 className="text-2xl font-light text-stone-900 italic tracking-tight border-l border-stone-100 pl-6 leading-none py-2">
             Regarding the {jobTitle} position
           </h2>
           {jobReference && <p className="text-[9px] font-black text-stone-300 tracking-widest pl-6 uppercase"># {jobReference}</p>}
        </div>

        <div className="space-y-8 text-[15px] leading-loose text-stone-600 font-light template-content">
           <p className="text-stone-900 font-bold tracking-tight uppercase text-xs">Dear {recipientName || "Hiring Team"},</p>
           <div className="space-y-6 first-letter:text-4xl first-letter:font-light first-letter:text-stone-900 first-letter:float-left first-letter:mr-4 first-letter:mt-1 first-letter:leading-none">
             {openingParagraph && <p>{openingParagraph}</p>}
             {bodyParagraph1 && <p>{bodyParagraph1}</p>}
             {bodyParagraph2 && <p>{bodyParagraph2}</p>}
             {closingParagraph && <p>{closingParagraph}</p>}
           </div>
        </div>

        {(jobSummary || jobDescription) && (
           <div className="pt-12 border-t border-stone-100 italic text-[11px] text-stone-400 font-medium text-center opacity-60 leading-relaxed px-12">
             {jobSummary || jobDescription}
           </div>
        )}
      </div>

      {/* Minimal Signature */}
      <div className="w-full max-w-2xl mt-24 pt-12 border-t border-stone-200 flex flex-col items-center">
        <p className="text-[9px] font-bold uppercase text-stone-300 tracking-widest mb-6 italic">{customSalutation || salutation || "Sincerely"}</p>
        <p className="text-2xl font-extralight text-stone-900 uppercase tracking-[0.15em] decoration-stone-100 underline decoration-1 underline-offset-[12px]">{fullName}</p>
      </div>
    </div>
  );
});

CleanTemplate.displayName = "CleanTemplate";

export default CleanTemplate;

