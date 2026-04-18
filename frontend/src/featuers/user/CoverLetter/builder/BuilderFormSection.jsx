import React, { memo } from "react";
import SenderInfoForm from "../forms/SenderInfoForm";
import RecipientInfoForm from "../forms/RecipientInfoForm";
import JobDetailsForm from "../forms/JobDetailsForm";
import BodyContentForm from "../forms/BodyContentForm";
import ClosingForm from "../forms/ClosingForm";

const BuilderFormSection = memo(({ 
  activeSection, 
  formData, 
  handleInputChange, 
  highlightEmpty 
}) => {
  switch (activeSection) {
    case "sender":
      return (
        <SenderInfoForm
          formData={formData}
          onInputChange={handleInputChange}
          highlightEmpty={highlightEmpty}
        />
      );

    case "recipient":
      return (
        <RecipientInfoForm
          formData={formData}
          onInputChange={handleInputChange}
          highlightEmpty={highlightEmpty}
        />
      );

    case "job":
      return (
        <JobDetailsForm
          formData={formData}
          onInputChange={handleInputChange}
          highlightEmpty={highlightEmpty}
        />
      );

    case "body":
      return (
        <BodyContentForm
          formData={formData}
          onInputChange={handleInputChange}
          highlightEmpty={highlightEmpty}
        />
      );

    case "closing":
      return (
        <ClosingForm
          formData={formData}
          onInputChange={handleInputChange}
          highlightEmpty={highlightEmpty}
        />
      );

    default:
      return null;
  }
});

BuilderFormSection.displayName = "BuilderFormSection";
export default BuilderFormSection;
