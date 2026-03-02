import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.post("/generate-pdf", async (req, res) => {
  let browser;
  
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML required' });

    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });  
    
    const page = await browser.newPage();
    const wrappedHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
${html}
</body>
</html>
`;

await page.setContent(wrappedHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1.64in', right: '1.24in', bottom: '1.14in', left: '1.24in' }
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Cover-Letter.pdf"`
    });
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  } finally {
    if (browser) await browser.close();
  }
});


export default router;
