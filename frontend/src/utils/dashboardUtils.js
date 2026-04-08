export const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "just now";
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date;

  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);

  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;

  return date.toLocaleDateString();
};

export const getActionText = (action) => {
  if (action === "visited") return "Viewed";
  if (action === "preview") return "Previewed";
  return "Downloaded";
};

export const getTypeIcon = (type) => {
  const iconMap = {
    resume: '📄',
    'cover-letter': '✉️',
    cv: '📋'
  };
  return iconMap[type] || '📄';
};
