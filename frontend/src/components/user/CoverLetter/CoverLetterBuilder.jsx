// ✅ COMPLETE CoverLetterBuilder.jsx - ALL FIXES APPLIED (Feb 19, 2026)
import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Building2, Briefcase, FileText, User,
  Download, AlertTriangle, FileText as FileTextIcon, X
} from 'lucide-react';
import { useEffect } from 'react';
import CoverLetterFormTabs from "./CoverLetterFormTabs";
import RecipientInfoForm from "./forms/RecipientInfoForm";
import JobDetailsForm from "./forms/JobDetailsForm";
import BodyContentForm from "./forms/BodyContentForm";
import ClosingForm from "./forms/ClosingForm";
import CoverLetterPreview from "./CoverLetterPreview";
import CoverLetterTemplates from "./CoverLetterTemplates";
import UserNavBar from "../UserNavBar/UserNavBar";
import "./CoverLetterBuilder.css";


const tabs = [
  { id: "recipient", label: "Recipient", icon: Building2 },
  { id: "job", label: "Job Details", icon: Briefcase },
  { id: "body", label: "Content", icon: FileText },
  { id: "closing", label: "Closing", icon: User },
];


const CoverLetterBuilder = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    recipientName: "",
    recipientTitle: "",
    companyName: "",
    companyAddress: "",
    jobTitle: "",
    jobReference: "",
    jobSummary: "",
    jobDescription: "",
    openingParagraph: "",
    bodyParagraph1: "",
    bodyParagraph2: "",
    closingParagraph: "",
    salutation: "Sincerely",
    customSalutation: "",
  });


  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [activeSection, setActiveSection] = useState("recipient");
  const [isExporting, setIsExporting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showMobilePreview ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobilePreview]);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  /* ===== PDF EXPORT - ALL FIXES APPLIED ===== */
  const exportToPDF = () => {
    if (!formData.fullName || !formData.jobTitle) {
      alert('Please fill your name and job title first');
      return;
    }


    setIsExporting(true);
    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Professional Cover Letter</title>
<style>
@page { margin: 1.25in 0.85in 0.75in 0.85in !important; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Times New Roman', Times, serif !important;
  font-size: 11pt !important;
  line-height: 1.3 !important;
  color: black !important;
  background: white !important;
  padding: 0 !important;
}


/* ✅ USER INFO - PERFECT SPACING (MATCHES RECIPIENT) */
.contact-info {
  text-align: right !important;
  margin-bottom: 18pt !important;
  font-size: 11pt !important;
  padding: 6pt 0 !important;
}
.contact-name {
  font-weight: bold !important;
  font-size: 11pt !important;
  margin-bottom: 2pt !important;
}
.contact-details {
  font-size: 9pt !important;
  line-height: 1.2 !important;
  margin-bottom: 4pt !important;
}
.contact-details div {
  margin-bottom: 1pt !important;
}
.letter-date {
  font-size: 11pt !important;
  margin-top: 4pt !important;
}


/* JOB REFERENCE */
.job-reference {
  text-align: center !important;
  margin: 12pt 0 !important;
  font-size: 10pt !important;
}
.job-title {
  font-weight: bold !important;
  font-size: 10pt !important;
  text-transform: uppercase !important;
}
.job-ref {
  font-size: 9pt !important;
  margin-top: 1pt !important;
}


/* JOB DETAILS */
.job-details-section {
  margin-bottom: 12pt !important;
  font-size: 10pt !important;
  font-style: italic !important;
  padding: 6pt 0 !important;
  border-left: 2px solid #666 !important;
  padding-left: 12pt !important;
}
.job-details-section div { margin-top: 4pt !important; }


/* ✅ RECIPIENT INFO - IDENTICAL SPACING */
.recipient-info {
  margin-bottom: 24pt !important;
  max-width: 4in !important;
  font-size: 10pt !important;
  padding-left: 6pt !important;
}
.recipient-info > div {
  margin-bottom: 2pt !important;
  line-height: 1.2 !important;
}
.recipient-name, .company-name {
  font-weight: bold !important;
  margin-bottom: 2pt !important;
}


.salutation {
  font-weight: bold !important;
  font-size: 11pt !important;
  margin: 6pt 0 12pt 0 !important;
}


.body-paragraph {
  text-indent: 0.2in !important;
  margin-bottom: 10pt !important;
  line-height: 1.4 !important;
  font-size: 11pt !important;
}
.body-paragraph:last-child { margin-bottom: 24pt !important; }


/* ✅ SIGNATURE - TIGHT SPACING */
.signature {
  margin-top: 24pt !important;
  text-align: right !important;
}
.signature-closing {
  margin-bottom: 2pt !important;
  font-size: 11pt !important;
  font-style: italic !important;
}
.signature-name {
  font-weight: bold !important;
  font-size: 11pt !important;
}


@media print { body { -webkit-print-color-adjust: exact !important; } }
</style>
</head>
<body onload="window.print(); setTimeout(() => window.close(), 1000);">
<div class="contact-info">
  <div class="contact-name">${formData.fullName || 'Your Name'}</div>
  ${formData.address ? formData.address.replace(/\n/g, '<br>') : ''}
  <div class="contact-details">
    ${formData.email ? formData.email : ''}
    ${formData.phone ? `<br>${formData.phone}` : ''}
    ${formData.linkedin ? `<br>${formData.linkedin}` : ''}
  </div>
  <div class="letter-date">${date}</div>
</div>


${(formData.jobTitle || formData.jobReference) ? `
<div class="job-reference">
  ${formData.jobTitle ? `<div class="job-title">RE: ${formData.jobTitle.toUpperCase()}</div>` : ''}
  ${formData.jobReference ? `<div class="job-ref">Ref: ${formData.jobReference}</div>` : ''}
</div>
` : ''}


${(formData.jobSummary || formData.jobDescription) ? `
<div class="job-details-section">
  ${formData.jobSummary ? `<div><strong>Job Summary:</strong> ${formData.jobSummary}</div>` : ''}
  ${formData.jobDescription ? `<div><strong>Key Responsibilities:</strong> ${formData.jobDescription}</div>` : ''}
</div>
` : ''}


<div class="recipient-info">
  <div class="recipient-name">${formData.recipientName || 'Hiring Manager'}</div>
  ${formData.recipientTitle ? `<div>${formData.recipientTitle}</div>` : ''}
  ${formData.companyName ? `<div class="company-name">${formData.companyName}</div>` : ''}
  ${formData.companyAddress ? formData.companyAddress.replace(/\n/g, '<br>') : ''}
</div>


<div class="salutation">Dear ${formData.recipientName || 'Hiring Manager'},</div>

<div class="body-paragraph">${(formData.openingParagraph || "I'm excited to apply for this position...").replace(/\n/g, '<br>')}</div>
<div class="body-paragraph">${(formData.bodyParagraph1 || "In my previous role...").replace(/\n/g, '<br>')}</div>
<div class="body-paragraph">${(formData.bodyParagraph2 || "My technical skills include...").replace(/\n/g, '<br>')}</div>
<div class="body-paragraph">${(formData.closingParagraph || "I'm particularly drawn to your company...").replace(/\n/g, '<br>')}</div>


<div class="signature">
  <div class="signature-closing">${formData.customSalutation || formData.salutation || 'Sincerely'}</div>
  <div class="signature-name">${formData.fullName || 'Your Name'}</div>
</div>
</body>
</html>`);
// <<<<<<< HEAD
// =======
   
// <<<<<<< HEAD
// >>>>>>> parent of e8bdcc6 (Merge branch 'main' of https://github.com/Rahulnam30/AI-Resume-Builder)
// =======
// >>>>>>> parent of e8bdcc6 (Merge branch 'main' of https://github.com/Rahulnam30/AI-Resume-Builder)
    printWindow.document.close();
    setTimeout(() => setIsExporting(false), 1500);
  };

  // Replace the ENTIRE `exportToWord` function with this corrected version:

  const exportToWord = () => {
    if (!formData.fullName || !formData.jobTitle) {
      alert('Please fill your name and job title first');
      return;
    }

    setIsExporting(true);

    const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Cover Letter - ${formData.jobTitle}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
<w:ValidateAgainstSchemas/>
<w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
<w:IgnoreMixedContent>false</w:IgnoreMixedContent>
<w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
<w:DoNotPromoteQF/>
<w:LidThemeOther>EN-US</w:LidThemeOther>
<w:LidThemeAsian>X-NONE</w:LidThemeAsian>
<w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
<w:Compatibility>
<w:BreakWrappedTables/>
<w:SnapToGridInCell/>
<w:WrapTextWithPunct/>
<w:UseAsianBreakRules/>
<w:DontGrowAutofit/>
<w:SplitPgBreakAndParaMark/>
<w:DontVertAlignCellWithSp/>
<w:DontBreakConstrainedForcedTables/>
<w:DontVertAlignInTxbx/>
<w:Word11KerningPairs/>
<w:CachedColBalance/>
</w:Compatibility>
<w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>
</xml>
<![endif]-->
<style>
@page {
  margin: 1.25in 0.85in 0.75in 0.85in !important;
  size: A4 portrait !important;
}
* { margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; }


/* ✅ TOP SPACING - 2 FULL LINES (36pt) */
body {
  font-family: 'Times New Roman', 'Times', serif !important;
  font-size: 11pt !important;
  line-height: 1.3 !important;
  color: black !important;
  background: white !important;
  padding: 36pt 0 0 0 !important; /* ✅ 2 LINES TOP SPACING */
  width: 794px !important;
  margin: 0 auto !important;
}


/* ✅ ALL CONTENT 11PT - PERFECT PDF MATCH */
.contact-info {
  text-align: right !important;
  margin-bottom: 18pt !important;
  font-size: 11pt !important;
  padding: 6pt 0 !important;
}
.contact-name {
  font-weight: bold !important;
  font-size: 11pt !important;
  margin-bottom: 2pt !important;
}
.contact-details {
  font-size: 11pt !important; /* ✅ CHANGED TO 11PT */
  line-height: 1.2 !important;
  margin-bottom: 4pt !important;
}
.contact-details div {
  margin-bottom: 1pt !important;
  font-size: 11pt !important; /* ✅ 11PT */
}
.letter-date {
  font-size: 11pt !important;
  margin-top: 4pt !important;
}


.job-reference {
  text-align: center !important;
  margin: 12pt 0 !important;
  font-size: 11pt !important; /* ✅ 11PT */
}
.job-title {
  font-weight: bold !important;
  font-size: 11pt !important; /* ✅ 11PT */
  text-transform: uppercase !important;
  margin-bottom: 1pt !important;
}
.job-ref {
  font-size: 11pt !important; /* ✅ 11PT */
}


.job-details-section {
  margin-bottom: 12pt !important;
  font-size: 11pt !important; /* ✅ 11PT */
  font-style: italic !important;
  padding: 6pt 0 !important;
  border-left: 2px solid #666 !important;
  padding-left: 12pt !important;
}
.job-details-section div {
  margin-top: 4pt !important;
  font-size: 11pt !important; /* ✅ 11PT */
}


.recipient-info {
  margin-bottom: 24pt !important;
  max-width: 4in !important;
  font-size: 11pt !important; /* ✅ 11PT */
  padding-left: 6pt !important;
}
.recipient-info > div {
  margin-bottom: 2pt !important;
  line-height: 1.2 !important;
  font-size: 11pt !important; /* ✅ 11PT */
}
.recipient-name, .company-name {
  font-weight: bold !important;
  margin-bottom: 2pt !important;
  font-size: 11pt !important; /* ✅ 11PT */
}
.recipient-title {
  margin-bottom: 2pt !important;
  font-size: 11pt !important; /* ✅ 11PT */
}


.salutation {
  font-weight: bold !important;
  font-size: 11pt !important;
  margin: 6pt 0 12pt 0 !important;
}


.body-paragraph {
  text-indent: 0.2in !important;
  margin-bottom: 10pt !important;
  line-height: 1.4 !important;
  font-size: 11pt !important;
}
.body-paragraph:last-child {
  margin-bottom: 24pt !important;
}


.signature {
  margin-top: 24pt !important;
  text-align: right !important;
}
.signature-closing {
  margin-bottom: 2pt !important;
  font-size: 11pt !important;
  font-style: italic !important;
}
.signature-name {
  font-weight: bold !important;
  font-size: 11pt !important;
}


p, div, span {
  font-family: inherit !important;
  font-size: 11pt !important; /* ✅ GLOBAL 11PT */
  line-height: inherit !important;
}
</style>
</head>
<body>
<div class="contact-info">
  <div class="contact-name">${formData.fullName || 'Your Name'}</div>
  ${formData.address ? formData.address.split('\n').filter(Boolean).map((line, i) => `<div>${line}</div>`).join('') : ''}
  <div class="contact-details">
    ${formData.email ? `<div>${formData.email}</div>` : ''}
    ${formData.phone ? `<div>${formData.phone}</div>` : ''}
    ${formData.linkedin ? `<div>${formData.linkedin}</div>` : ''}
  </div>
  <div class="letter-date">${date}</div>
</div>


${(formData.jobTitle || formData.jobReference) ? `
<div class="job-reference">
  ${formData.jobTitle ? `<div class="job-title">RE: ${formData.jobTitle.toUpperCase()}</div>` : ''}
  ${formData.jobReference ? `<div class="job-ref">Ref: ${formData.jobReference}</div>` : ''}
</div>
` : ''}


${(formData.jobSummary || formData.jobDescription) ? `
<div class="job-details-section">
  ${formData.jobSummary ? `<div><strong>Job Summary:</strong> ${formData.jobSummary}</div>` : ''}
  ${formData.jobDescription ? `<div><strong>Key Responsibilities:</strong> ${formData.jobDescription}</div>` : ''}
</div>
` : ''}


<div class="recipient-info">
  <div class="recipient-name">${formData.recipientName || 'Hiring Manager'}</div>
  ${formData.recipientTitle ? `<div class="recipient-title">${formData.recipientTitle}</div>` : ''}
  ${formData.companyName ? `<div class="company-name">${formData.companyName}</div>` : ''}
  ${formData.companyAddress ? formData.companyAddress.split('\n').filter(Boolean).map((line, i) => `<div>${line}</div>`).join('') : ''}
</div>


<div class="salutation">Dear ${formData.recipientName || 'Hiring Manager'},</div>


<div class="body-paragraph">${(formData.openingParagraph || "I'm excited to apply for this position...").replace(/\n/g, '<br>')}</div>
<div class="body-paragraph">${(formData.bodyParagraph1 || "In my previous role...").replace(/\n/g, '<br>')}</div>
<div class="body-paragraph">${(formData.bodyParagraph2 || "My technical skills include...").replace(/\n/g, '<br>')}</div>
<div class="body-paragraph">${(formData.closingParagraph || "I'm particularly drawn to your company...").replace(/\n/g, '<br>')}</div>


<div class="signature">
  <div class="signature-closing">${formData.customSalutation || formData.salutation || 'Sincerely'}</div>
  <div class="signature-name">${formData.fullName || 'Your Name'}</div>
</div>
</body>
</html>`; // ✅ END HTML

    const blob = new Blob(["\ufeff", html], {
      type: "application/msword;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover-Letter-${formData.jobTitle.replace(/[^a-zA-Z0-9]/g, '-')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

// <<<<<<< HEAD
    setTimeout(() => setIsExporting(false), 800);
  };
// =======

//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `Cover-Letter-${formData.jobTitle.replace(/[^a-zA-Z0-9]/g, '-')}.doc`;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// URL.revokeObjectURL(url);


//   setTimeout(() => setIsExporting(false), 800);
// };
// >>>>>>> parent of e8bdcc6 (Merge branch 'main' of https://github.com/Rahulnam30/AI-Resume-Builder)

  const currentIdx = tabs.findIndex(t => t.id === activeSection);
  const goLeft = () => currentIdx > 0 && setActiveSection(tabs[currentIdx - 1].id);
  const goRight = () => currentIdx < tabs.length - 1 && setActiveSection(tabs[currentIdx + 1].id);


  const renderFormContent = () => {
    switch (activeSection) {
      case "recipient": return <RecipientInfoForm formData={formData} onInputChange={handleInputChange} />;
      case "job": return <JobDetailsForm formData={formData} onInputChange={handleInputChange} />;
      case "body": return <BodyContentForm formData={formData} onInputChange={handleInputChange} />;
      case "closing": return <ClosingForm formData={formData} onInputChange={handleInputChange} />;
      default: return null;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 relative z-0">
      <UserNavBar />
      <div className="px-2 py-4 sm:px-4 lg:px-4 w-screen max-w-full mx-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-6 gap-3 lg:gap-4 px-2">
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold font-['Outfit'] text-gray-900 leading-tight">
            Create Cover Letter
          </h1>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 disabled:opacity-60 transition-all font-medium text-sm"
            >
              <Download size={16} /> PDF
            </button>
            <button
              onClick={exportToWord}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-60 transition-all font-medium text-sm"
            >
              <Download size={16} /> Word
            </button>
          </div>
        </div>
        <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 shadow-sm px-2">
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <span className="text-sm font-medium text-amber-800">Fill Job Summary & Description in Job Details tab for complete professional letter.</span>
        </div>
        <div className="flex h-[calc(100vh-[180px])] gap-[10px] w-full mt-2 lg:mt-5 p-0 sm:p-2 lg:flex-row flex-col max-w-[1920px] mx-auto overflow-hidden relative z-10">
          {/* FORM PANEL */}
          <div className="bg-white rounded-xl h-full overflow-hidden flex flex-col w-full lg:w-[520px] shrink-0 border border-slate-200 order-2 lg:order-1 relative z-20">
            <CoverLetterFormTabs
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onTogglePreview={() => setShowMobilePreview(v => !v)}
            />
            <div className="mt-3 flex-1 overflow-y-auto py-2 pr-2">{renderFormContent()}</div>

            <div className="flex justify-between items-center mt-auto p-4 border-t border-slate-100 bg-white">
              <button
                onClick={goLeft}
                disabled={currentIdx === 0}
                className="flex gap-1 items-center text-sm bg-slate-100 px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft size={18} /> Previous
              </button>
              <div className="flex-1 text-center text-xs text-gray-500 font-medium">
                Step {currentIdx + 1} of {tabs.length}
              </div>
              <button
                onClick={goRight}
                disabled={currentIdx === tabs.length - 1}
                className="flex gap-1 items-center text-sm bg-black text-white px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {currentIdx === tabs.length - 1 ? "Finish" : "Next"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className="hidden lg:flex flex-col flex-1 min-w-0 bg-[#eef2f7] rounded-xl overflow-hidden border border-slate-200 relative order-1 lg:order-2 z-10">
            <CoverLetterPreview
              formData={formData}
              exportDate={date}
            />
          </div>
        </div>
      </div>

      {/* Mobile preview overlay */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobilePreview(false)}
          />
          <div
            className="relative mt-auto bg-white rounded-t-2xl shadow-2xl flex flex-col"
            style={{
              height: "92dvh",
              animation: "clPreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
              <span className="text-sm font-semibold text-slate-700">
                Cover Letter Preview
              </span>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CoverLetterPreview
                formData={formData}
                exportDate={date}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes clPreviewSlideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
};


export default CoverLetterBuilder;



