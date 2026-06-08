import jsPDF from "jspdf";

export function generateResumePdf(text: string) {
  const doc = new jsPDF();

  const lines = doc.splitTextToSize(text, 180);

  doc.setFontSize(12);

  doc.text(lines, 15, 20);

  doc.save("optimized-resume.pdf");
}
