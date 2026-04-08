import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axios';

export const useRecentDocuments = () => {
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchRecent = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/downloads/recent?limit=50&page=1");
      
      const downloadedDocs = res.data.downloads;
      
      const docs = downloadedDocs.map((d) => ({
        id: d._id?.toString?.() || d.id,
        name: d.name,
        type: d.type,
        action: d.action || "download",
        format: (d.format || (d.type === "cover-letter" ? "DOCX" : "PDF")).toUpperCase(),
        template: d.template,
        size: d.size || "200 KB",
        downloadDate: d.downloadDate,
      }));

      docs.sort((a, b) => new Date(b.downloadDate) - new Date(a.downloadDate));

      // Keep only the newest activity per type
      const latest = {};
      docs.forEach((doc) => {
        if (
          !latest[doc.type] ||
          new Date(doc.downloadDate) > new Date(latest[doc.type].downloadDate)
        ) {
          latest[doc.type] = doc;
        }
      });

      setRecentDocs(Object.values(latest));
    } catch (err) {
      console.error("Failed to fetch recent documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecent();
    
    // Set up visibility change listener instead of aggressive polling
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRecent();
      }
    };

    const handleFocus = () => {
      fetchRecent();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchRecent]);

  const handlePreview = useCallback(async (doc) => {
    try {
      setPreviewLoading(true);
      const res = await axiosInstance.get(`/api/downloads/${doc.id}`);
      setPreviewDoc({
        ...doc,
        html: res.data.html,
      });
    } catch (err) {
      console.error("Preview failed:", err);
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async (doc) => {
    try {
      const url =
        doc.format === "DOCX"
          ? `/api/downloads/${doc.id}/word`
          : `/api/downloads/${doc.id}/pdf`;

      const res = await axiosInstance.get(url, { responseType: "blob" });

      const blob = new Blob([res.data], {
        type:
          doc.format === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${doc.name}.${doc.format.toLowerCase()}`;
      link.click();

      // Refresh after download
      setTimeout(() => fetchRecent(), 500);
    } catch {
      alert("Download failed");
    }
  }, [fetchRecent]);

  return {
    recentDocs,
    loading,
    previewDoc,
    previewLoading,
    handlePreview,
    handleDownload,
    setPreviewDoc,
    refetch: fetchRecent
  };
};
