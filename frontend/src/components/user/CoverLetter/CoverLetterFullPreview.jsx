import { ArrowLeft, Download, Printer, Share2 } from "lucide-react";

const CoverLetterFullPreview = ({
  formData,
  selectedTemplate,
  setActiveTab,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log("Downloading cover letter...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="full-preview-container">
      <div className="full-preview-toolbar">
        <button
          className="toolbar-btn back"
          onClick={() => setActiveTab("builder")}
        >
          <ArrowLeft size={18} />
          Back to Editor
        </button>
        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
          <button className="toolbar-btn">
            <Share2 size={18} />
            Share
          </button>
          <button className="toolbar-btn primary" onClick={handleDownload}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="full-preview-wrapper">
        <div className={`full-preview-document template-${selectedTemplate}`}>
          <div className="letter-page">
            {/* Sender Info */}
            <div className="sender-info">
              <p className="sender-name">{formData.fullName || "Your Name"}</p>
              {formData.address && <p>{formData.address}</p>}
              <div className="contact-row">
                {formData.email && <span>{formData.email}</span>}
                {formData.email && formData.phone && (
                  <span className="separator">|</span>
                )}
                {formData.phone && <span>{formData.phone}</span>}
              </div>
              {formData.linkedin && (
                <p className="linkedin">{formData.linkedin}</p>
              )}
            </div>

            {/* Date */}
            <p className="letter-date">{formatDate(formData.letterDate)}</p>

            {/* Recipient Info */}
            <div className="recipient-info">
              {formData.recipientName ? (
                <>
                  <p className="recipient-name">{formData.recipientName}</p>
                  {formData.recipientTitle && <p>{formData.recipientTitle}</p>}
                </>
              ) : (
                <p className="recipient-name">Hiring Manager</p>
              )}
              {formData.companyName && (
                <p className="company">{formData.companyName}</p>
              )}
              {formData.companyAddress && <p>{formData.companyAddress}</p>}
            </div>

            {/* Subject Line */}
            {formData.jobTitle && (
              <p className="subject-line">
                <strong>
                  Re: Application for {formData.jobTitle} Position
                </strong>
                {formData.jobReference && (
                  <span> (Ref: {formData.jobReference})</span>
                )}
              </p>
            )}

            {/* Greeting */}
            <p className="greeting">
              Dear {formData.recipientName || "Hiring Manager"},
            </p>

            {/* Body */}
            <div className="letter-body">
              {formData.openingParagraph && <p>{formData.openingParagraph}</p>}
              {formData.bodyParagraph1 && <p>{formData.bodyParagraph1}</p>}
              {formData.bodyParagraph2 && <p>{formData.bodyParagraph2}</p>}
              {formData.closingParagraph && <p>{formData.closingParagraph}</p>}
            </div>

            {/* Closing */}
            <div className="letter-closing">
              <p className="salutation">
                {formData.salutation === "custom"
                  ? formData.customSalutation
                  : formData.salutation}
                ,
              </p>
              <p className="signature">{formData.fullName || "Your Name"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterFullPreview;
