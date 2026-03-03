import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, ImageRun, AlignmentType, WidthType } from 'docx';

export const exportFile = async (req, res) => {
  try {
    const { html, format, formData } = req.body;
    if (!html) {
      return res.status(400).json({ message: 'HTML required' });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    // Match preview exactly: A4 viewport, full CSS loaded
    await page.setViewport({ width: 794, height: 1123 }); // A4 pixels @96dpi
    await page.setContent(html, { waitUntil: 'networkidle0' });

    let buffer;
    const filename = `cover-letter-${(formData?.jobTitle || 'cover').replace(/[^a-zA-Z0-9]/g, '-')}`;

    if (format === 'pdf') {
      buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: '72pt', right: '72pt', bottom: '72pt', left: '72pt' }
      });
    } else if (format === 'docx') {
      // Screenshot matches preview pixel-perfect
      const imageBuffer = await page.screenshot({ 
        type: 'png', 
        fullPage: true,
        omitBackground: false 
      });

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: { width: 12240, height: 15840 }, // A4 twips
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 595, height: 842, // A4 pt dimensions
                    type: WidthType.PIXELS
                  }
                })
              ]
            })
          ]
        }]
      });
      buffer = await Packer.toBuffer(doc);
    } else {
      await browser.close();
      return res.status(400).json({ message: 'Format must be pdf or docx' });
    }

    await browser.close();

    res.set({
      'Content-Type': format === 'pdf' ? 
        'application/pdf' : 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}.${format}"`,
      'Content-Length': buffer.length
    });
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Export failed', error: err.message });
  }
};
