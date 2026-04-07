import { useState, useCallback } from 'react';
import DocumentParser from '../services/DocumentParser.service.js';

const useDocumentParser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseDocument = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const arrayBuffer = await file.arrayBuffer();
      const text = await DocumentParser.extractTextFromDocument(null, arrayBuffer);
      
      return text;
    } catch (err) {
      const errorMessage = `Failed to parse document: ${err.message}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const parseDocumentToHtml = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const arrayBuffer = await file.arrayBuffer();
      const html = await DocumentParser.extractHtmlFromDocument(null, arrayBuffer);
      
      return html;
    } catch (err) {
      const errorMessage = `Failed to convert document to HTML: ${err.message}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    parseDocument,
    parseDocumentToHtml,
    loading,
    error,
    clearError: () => setError(null),
  };
};

export default useDocumentParser;
