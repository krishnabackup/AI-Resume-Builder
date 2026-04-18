export const formatExternalUrl = (url = "") => {
  if (!url) return "";
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const formatMailto = (email = "") => {
  if (!email) return "";
  return `mailto:${email.trim()}`;
};

export const formatTel = (phone = "") => {
  if (!phone) return "";
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return `tel:${normalized}`;
};

export const getVisibleExtraLinks = (extraLinks = []) => {
  if (!Array.isArray(extraLinks)) return [];

  return extraLinks.filter(
    (link) =>
      link?.label &&
      link?.url &&
      link.label.trim() !== "" &&
      link.url.trim() !== "" &&
      link.label.trim().toLowerCase() !== "enter platform",
  );
};
