import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../../../api/axios";

const DEBOUNCE_MS = 1000;
const IDLE_TIMEOUT_MS = 3000;

const useCoverLetterAutosave = (formData, templateId, documentTitle) => {
  const [saveStatus, setSaveStatus] = useState("idle");

  const mountedRef = useRef(true);
  const isFirstRender = useRef(true);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const saveToBackend = useCallback(async (data, tId, title) => {
    if (!data) return;

    try {
      if (mountedRef.current) setSaveStatus("saving");
      
      await axiosInstance.put("/api/coverletter", {
        content: data,
        templateId: tId,
        documentTitle: title,
      });

      if (mountedRef.current) {
        setSaveStatus("saved");
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        
        idleTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setSaveStatus("idle");
        }, IDLE_TIMEOUT_MS);
      }
    } catch (err) {
      console.error("Cover letter autosave failed:", err);
      if (mountedRef.current) setSaveStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!formData) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveToBackend(formData, templateId, documentTitle);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [formData, templateId, documentTitle, saveToBackend]);

  return saveStatus;
};

export default useCoverLetterAutosave;

