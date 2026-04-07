import mammoth from "mammoth";

class DocumentParser {
  static async extractTextFromDocument(filePath, arrayBuffer = null) {
    try {
      let result;
      
      if (arrayBuffer) {
        // For frontend usage with arrayBuffer
        result = await mammoth.extractRawText({ arrayBuffer });
      } else if (filePath) {
        // For backend usage with file path
        result = await mammoth.extractRawText({ path: filePath });
      } else {
        throw new Error('Either filePath or arrayBuffer must be provided');
      }
      
      return result.value;
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error(`Failed to extract text from document: ${error.message}`);
    }
  }

  static async extractHtmlFromDocument(filePath, arrayBuffer = null) {
    try {
      let result;
      
      if (arrayBuffer) {
        result = await mammoth.convertToHtml({ arrayBuffer });
      } else if (filePath) {
        result = await mammoth.convertToHtml({ path: filePath });
      } else {
        throw new Error('Either filePath or arrayBuffer must be provided');
      }
      
      return result.value;
    } catch (error) {
      console.error('Error converting document to HTML:', error);
      throw new Error(`Failed to convert document to HTML: ${error.message}`);
    }
  }
}

export default DocumentParser;
