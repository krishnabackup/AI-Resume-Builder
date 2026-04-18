export const getCompletionStatus = (formData) => {
  const missing = [];

  /* ---------- PERSONAL INFO ---------- */
  const hasPersonalInfo =
    formData?.fullName?.trim() &&
    formData?.email?.trim() &&
    formData?.linkedin?.trim() &&
    formData?.location?.trim() &&
    formData?.phone?.trim() &&
    formData?.website?.trim();

  if (!hasPersonalInfo) missing.push("Personal");

  /* ---------- EXPERIENCE ---------- */
  const hasValidExperience =
    Array.isArray(formData?.experience) &&
    formData.experience.length > 0 &&
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
    formData.education.length > 0 &&
    formData.education.every(
      (edu) =>
        edu.school?.trim() &&
        edu.degree?.trim() &&
        edu.startDate?.trim() &&
        edu.graduationDate?.trim(),
    );

  if (!hasValidEducation) {
    missing.push("Education");
  }

  /* ---------- Project INFO ---------- */
  const hasValidProject =
    Array.isArray(formData?.projects) &&
    formData.projects.length > 0 &&
    formData.projects.every(
      (project) =>
        project.name?.trim() &&
        project.description?.trim() &&
        project.technologies?.trim() &&
        (typeof project.link === 'string' ? project.link.trim() : (
          project.link?.github?.trim() ||
          project.link?.liveLink?.trim() ||
          project.link?.other?.trim()
        )),
    );

  if (!hasValidProject) {
    missing.push("Projects");
  }

  /* ---------- Certification INFO ---------- */
  const hasValidCertificationInfo =
    Array.isArray(formData?.certifications) &&
    formData.certifications.length > 0 &&
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
