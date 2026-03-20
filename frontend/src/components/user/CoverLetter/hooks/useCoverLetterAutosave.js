/**
 * useCoverLetterAutosave
 *
 * Debounced (1 second) autosave of cover letter data to the backend.
 * Replaces the old localStorage approach — data is now scoped per user
 * and persisted in MongoDB.
 *
 * Returns a saveStatus string: 'idle' | 'saving' | 'saved' | 'error'
 */
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../../api/axios";

const DEBOUNCE_MS = 1000;

const useCoverLetterAutosave = (formData, templateId, documentTitle) => {
  const [saveStatus, setSaveStatus] = useState("idle"); // 'idle'|'saving'|'saved'|'error'

  // Track whether the component is mounted to avoid setting state after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Don't trigger on the very first render (before user has loaded their data)
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (mountedRef.current) setSaveStatus("saving");

    const timer = setTimeout(async () => {
      try {
        await axiosInstance.put("/api/coverletter", {
          content: formData,
          templateId,
          documentTitle,
        });
        if (mountedRef.current) setSaveStatus("saved");

        // Reset to idle after 3 seconds so the "Saved ✓" indicator fades
        setTimeout(() => {
          if (mountedRef.current) setSaveStatus("idle");
        }, 3000);
      } catch (err) {
        console.error("Cover letter autosave failed:", err);
        if (mountedRef.current) setSaveStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, templateId, documentTitle]);

  return saveStatus;
};

export default useCoverLetterAutosave;
