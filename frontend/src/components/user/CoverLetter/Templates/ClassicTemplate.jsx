import React from "react";

const ClassicTemplate = ({ formData }) => {
  const {
    fullName, email, phone, address, linkedin,
    recipientName, recipientTitle, companyName, companyAddress,
    jobTitle, jobReference, jobSummary, jobDescription,
    openingParagraph, bodyParagraph1, bodyParagraph2, closingParagraph,
    salutation, customSalutation
  } = formData || {};

  return (
    <div className="w-full bg-white p-20 text-gray-900 font-serif leading-relaxed min-h-[297mm] flex flex-col border-[24px] border-double border-gray-100">
      <style>{`
        @page { size: A4; margin: 0; }
        .template-content { word-wrap: break-word; }
      `}</style>
      
      {/* Centered Formal Header */}
      <header className="mb-20 text-center border-b-[6px] border-double border-gray-200 pb-12">
        <div className="italic text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-6">Curriculum Vitae Attachment</div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-8 uppercase decoration-gray-200 underline decoration-1 underline-offset-8 decoration-dashed">{fullName || "Mr./Ms. Candidate"}</h1>
        <div className="flex flex-col items-center gap-2 text-xs font-semibold italic text-gray-500">
           <div className="flex gap-12">
              <span>Contact: {phone}</span>
              <span className="text-gray-200">|</span>
              <span>Electronic Mail: {email}</span>
           </div>
           <div className="flex gap-12 mt-1">
              <span className="truncate max-w-[200px]">Profile: {linkedin}</span>
              <span className="text-gray-200">|</span>
              <span className="whitespace-pre-line underline decoration-gray-100">Residing at: {address}</span>
           </div>
        </div>
      </header>

      {/* Formal Recipient Section */}
      <div className="flex justify-between items-start mb-16 px-8">
         <div className="text-sm space-y-2 border-l-2 border-gray-100 pl-10 pt-2">
            <h4 className="text-[9px] font-black uppercase text-gray-300 tracking-widest mb-4 italic">Memorandum To</h4>
            <p className="text-xl font-bold text-gray-900 italic underline-offset-4 underline decoration-gray-100 decoration-4">{recipientName}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{recipientTitle}</p>
            <p className="text-xs font-black text-gray-900 uppercase tracking-tight py-2 leading-none border-y border-gray-50">{companyName}</p>
            <p className="text-[10px] italic text-gray-400 whitespace-pre-line leading-relaxed">{companyAddress}</p>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2 italic">Calendar Date</p>
            <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {jobReference && <div className="mt-8 text-[9px] font-black px-4 py-2 border border-gray-100 bg-gray-50 uppercase tracking-widest shadow-inner">Serial: {jobReference}</div>}
         </div>
      </div>

      {/* Substantive Content */}
      <div className="flex-1 space-y-10 px-8 template-content">
         <div className="border-y-2 border-gray-50 py-4 flex flex-col gap-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Notice of Formal Application</h3>
            <p className="text-lg font-bold italic text-gray-900 leading-tight">Selection process for the position of {jobTitle}</p>
            {jobSummary && <p className="text-xs text-gray-400 font-medium italic indent-0 border-l border-gray-100 pl-4 py-1">{jobSummary}</p>}
         </div>

         <div className="space-y-8 text-[16px] text-gray-800 antialiased indent-12 first-line:uppercase first-line:tracking-widest first-line:text-xs first-line:font-black">
            <p className="indent-0 text-xl font-bold italic text-gray-900 underline decoration-gray-50 decoration-8 underline-offset-[-4px]">
               Honorable {recipientName || "Member of the Search Committee"},
            </p>
            <p>{openingParagraph}</p>
            <p>{bodyParagraph1}</p>
            <p>{bodyParagraph2}</p>
            <p>{closingParagraph}</p>
         </div>
      </div>

      {/* Formal Closing */}
      <div className="mt-20 px-8 py-10 border-t-4 border-double border-gray-100 flex justify-between items-center">
         <div className="text-[10px] font-bold text-gray-200 uppercase tracking-widest italic select-none">Transmitted via UpToSkills AI</div>
         <div className="text-right">
            <p className="text-sm font-bold italic text-gray-400 mb-8">{customSalutation || salutation || "Yours Respectfully"},</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tighter italic decoration-gray-100 underline decoration-[10px] underline-offset-[-2px]">{fullName}</p>
            <div className="h-px bg-gray-900 w-full mt-4 opacity-10"></div>
         </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
