export const getCompletionStatus = (formData) => {
  const missing = [];

  /* ---------- PERSONAL INFO ---------- */
  const hasPersonalInfo =
    formData?.fullName?.trim() &&
    formData?.email?.trim() &&
    formData?.phone?.trim() &&
    formData?.location?.trim();

  if (!hasPersonalInfo) missing.push("Personal");

  /* ---------- EXPERIENCE ---------- */
  // Empty experience is allowed (user can skip); only validate if entries exist
  const hasValidExperience =
    !Array.isArray(formData?.experience) ||
    formData.experience.length === 0 ||
    formData.experience.every(
      (exp) =>
        exp.title?.trim() &&
        exp.company?.trim() &&
        exp.description?.trim() &&
        exp.startDate?.trim() &&
        exp.endDate?.trim(),
    );

  if (!hasValidExperience) {
    missing.push("Work");
  }

  /* ----------  EDUCATION ---------- */
  const hasValidEducation =
    Array.isArray(formData?.education) &&
    formData.education.length > 0;

  if (!hasValidEducation) {
    missing.push("Education");
  }

  /* ---------- Project INFO ---------- */
  // Empty projects list is allowed; only validate if entries exist
  const hasValidProject =
    !Array.isArray(formData?.projects) ||
    formData.projects.length === 0 ||
    formData.projects.every(
      (project) =>
        project.name?.trim() &&
        project.description?.trim() &&
        project.technologies?.trim(),
    );

  if (!hasValidProject) {
    missing.push("Projects");
  }

  /* ---------- Certification INFO ---------- */
  // Empty certifications list is allowed; only validate if entries exist
  const hasValidCertificationInfo =
    !Array.isArray(formData?.certifications) ||
    formData.certifications.length === 0 ||
    formData.certifications.every(
      (cert) => cert.name?.trim() && cert.issuer?.trim() && cert.date?.trim(),
    );

  if (!hasValidCertificationInfo) {
    missing.push("Certifications");
  }

  /* ---------- SKILLS ---------- */
  const hasSkills =
    (formData?.skills?.technical?.length ?? 0) > 0 ||
    (formData?.skills?.soft?.length ?? 0) > 0;

  if (!hasSkills) missing.push("Skills");

  return {
    isComplete: missing.length === 0,
    missingSections: missing || [],
    //for ai generation
    sectionValidationStatus: {
      hasValidExperience,
      hasValidEducation,
      hasValidProject,
      hasValidCertificationInfo,
      hasSkills,
    },
  };
};
