import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ImpactResult } from './impactCalculator';

export const generatePDF = async (results: ImpactResult, userEmail: string) => {
  try {
    // Capture the results page as canvas
    const resultsElement = document.querySelector('[data-results-container]') as HTMLElement;
    if (!resultsElement) {
      throw new Error('Results container not found');
    }
    
    // Create canvas from the results page
    const canvas = await html2canvas(resultsElement, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: resultsElement.scrollWidth,
      height: resultsElement.scrollHeight
    });
    
    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit A4
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    
    // Add image to PDF
    doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Save the PDF
    const filename = `diagnostic-ecrans-personnalise-${Date.now()}.pdf`;
    doc.save(filename);
    return filename;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to simple text PDF
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(240, 77, 94);
    doc.text('Diagnostic Écrans Personnalisé', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Email: ${userEmail}`, 20, 45);
    doc.text(`Score d'impact: ${results.totalScore}/100`, 20, 60);
    
    const shockLines = doc.splitTextToSize(results.shockPhrase, 170);
    doc.text(shockLines, 20, 80);
    
    let yPos = 100;
    doc.text('Recommandations:', 20, yPos);
    yPos += 15;
    
    results.recommendations.forEach((rec) => {
      const lines = doc.splitTextToSize(`• ${rec}`, 170);
      lines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 25, yPos);
        yPos += 12;
      });
    });
    
    const filename = `diagnostic-ecrans-${Date.now()}.pdf`;
    doc.save(filename);
    return filename;
  }
};