import axiosInstance from "../../../../api/axios";

export const DEFAULT_FORM_DATA = Object.freeze({
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

export const TABS = Object.freeze([
  { id: "sender", label: "Personal" },
  { id: "recipient", label: "Recipient" },
  { id: "job", label: "Job Details" },
  { id: "body", label: "Content" },
  { id: "closing", label: "Closing" },
]);

export const getCoverLetterCompletionStatus = (formData) => {
  const missing = [];

  /* ---------- SENDER INFO ---------- */
  const hasSenderInfo = formData?.fullName?.trim() && formData?.email?.trim();
  if (!hasSenderInfo) missing.push("Sender");

  /* ---------- RECIPIENT INFO ---------- */
  const hasRecipientInfo = formData?.companyName?.trim();
  if (!hasRecipientInfo) missing.push("Recipient");

  /* ---------- JOB DETAILS ---------- */
  const hasJobDetails = formData?.jobTitle?.trim() && formData?.companyName?.trim();
  if (!hasJobDetails) missing.push("Job");

  /* ---------- BODY CONTENT ---------- */
  const hasBodyContent =
    formData?.openingParagraph?.trim() && 
    formData?.bodyParagraph1?.trim() && 
    formData?.closingParagraph?.trim();
  if (!hasBodyContent) missing.push("Body");

  /* ---------- CLOSING ---------- */
  const hasClosing =
    formData?.salutation?.trim() &&
    (formData.salutation !== "custom" || formData?.customSalutation?.trim());
  if (!hasClosing) missing.push("Closing");

  return {
    isComplete: missing.length === 0,
    missingSections: missing,
  };
};

export const isSectionValid = (section, formData) => {
  switch (section) {
    case "sender":
      return formData?.fullName?.trim() && formData?.email?.trim();
    case "recipient":
      return formData?.companyName?.trim();
    case "job":
      return formData?.jobTitle?.trim() && formData?.companyName?.trim();
    case "body":
      return (
        formData?.openingParagraph?.trim() && 
        formData?.bodyParagraph1?.trim() && 
        formData?.closingParagraph?.trim()
      );
    case "closing":
      return (
        formData?.salutation?.trim() &&
        (formData.salutation !== "custom" || formData?.customSalutation?.trim())
      );
    default:
      return true;
  }
};

export const getRequiredFieldsMessage = (section) => {
  switch (section) {
    case "sender":
      return "Your Name and Email are required";
    case "recipient":
      return "Company Name is required";
    case "job":
      return "Job Title is required";
    case "body":
      return "Opening Paragraph, Body Paragraph 1 and Closing Paragraph are required";
    case "closing":
      return "Salutation is required";
    default:
      return "";
  }
};

export const buildPuppeteerHtml = (innerHtml, fileName = "Cover-Letter") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fileName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }
    @page { margin: 0; size: A4; }
  </style>
</head>
<body style="width:794px;">
  ${innerHtml}
</body>
</html>
`;

export const saveDownloadRecord = async (html, documentTitle, fullName, selectedTemplate, format = "PDF") => {
  try {
    await axiosInstance.post("/api/downloads", {
      name: `Cover Letter - ${documentTitle || fullName || "Document"}`,
      type: "cover-letter",
      format,
      html,
      template: selectedTemplate,
      size: format === "PDF" ? "150 KB" : "200 KB",
    });
  } catch (err) {
    console.error("Failed to save cover letter download:", err);
  }
};

export const saveRecentActivity = async (html, documentTitle, fullName, selectedTemplate, action = "visited") => {
  try {
    const sanitize = (s) => (s || "").replace(/[^a-z0-9_\- ]/gi, "").trim().replace(/\s+/g, "_");
    const nameToUse = sanitize(documentTitle) || sanitize(fullName) || "Document";

    await axiosInstance.post("/api/downloads", {
      name: `Cover Letter - ${nameToUse}`,
      type: "cover-letter",
      action,
      format: "PDF",
      html,
      template: selectedTemplate,
      size: "150 KB",
    });
  } catch (err) {
    console.error("Failed to save cover letter activity:", err);
  }
};
