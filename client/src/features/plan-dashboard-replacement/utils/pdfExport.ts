import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Professional PDF export for stakeholder/investor presentations.
 * Generates pure data tables (no charts) via jsPDF AutoTable without breaking UI.
 */
export async function exportDashboardPDF(
  contentElement: HTMLElement,
  title: string,
  subtitle: string,
): Promise<void> {
  if (!contentElement) return;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const drawHeader = (p: jsPDF) => {
    // Orange accent bar
    p.setFillColor(255, 90, 31);
    p.rect(0, 0, 210, 3, 'F');

    // Logo area
    p.setFillColor(255, 90, 31);
    p.roundedRect(8, 6, 12, 10, 2, 2, 'F');
    p.setTextColor(255, 255, 255);
    p.setFontSize(7);
    p.setFont('helvetica', 'bold');
    p.text('GLX', 14, 12.5, { align: 'center' });

    // Titles
    p.setTextColor(17, 24, 39);
    p.setFontSize(12);
    p.setFont('helvetica', 'bold');
    p.text(title, 23, 10);

    p.setTextColor(107, 114, 128);
    p.setFontSize(8);
    p.setFont('helvetica', 'normal');
    p.text(subtitle, 23, 14.5);

    p.setTextColor(107, 114, 128);
    p.setFontSize(7);
    p.text(dateStr, 202, 10, { align: 'right' });

    p.setDrawColor(229, 231, 235);
    p.setLineWidth(0.3);
    p.line(8, 20, 202, 20);
  };

  const drawFooter = (p: jsPDF) => {
    const pageCount = p.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      p.setPage(i);
      p.setTextColor(107, 114, 128);
      p.setFontSize(7);
      p.text(`Página ${i} de ${pageCount}`, 202, 14, { align: 'right' });

      p.setDrawColor(229, 231, 235);
      p.setLineWidth(0.3);
      p.line(8, 285, 202, 285);
      p.setTextColor(156, 163, 175);
      p.setFontSize(7);
      p.setFont('helvetica', 'normal');
      p.text('GLX Performance Control Tower — Confidencial', 8, 291);
      p.text('© 2026 GLX Partners. Todos os direitos reservados.', 202, 291, { align: 'right' });
    }
  };

  // Extract Sections to support all tabs
  const sections = contentElement.querySelectorAll('.pdf-export-section');
  const elementsToProcess = sections.length > 0 ? Array.from(sections) : [contentElement];

  // Add initial page header
  drawHeader(pdf);

  elementsToProcess.forEach((section, idx) => {
    const sectionTitle = section.getAttribute('data-title');

    // Page break or space for new sections
    if (idx > 0) {
      if ((pdf as any).lastAutoTable) {
        if ((pdf as any).lastAutoTable.finalY > 250) {
          pdf.addPage();
          (pdf as any).lastAutoTable.finalY = 26;
        } else {
          (pdf as any).lastAutoTable.finalY += 15;
        }
      }
    }

    let startY = (pdf as any).lastAutoTable ? (pdf as any).lastAutoTable.finalY : 26;

    if (sectionTitle) {
      pdf.setFontSize(14);
      pdf.setTextColor(255, 90, 31);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Aba: ${sectionTitle}`, 8, startY);
      startY += 5;
    }

    // Extract Cards
    const cards = section.querySelectorAll('.overview-card');
    const cardData: string[][] = [];
    cards.forEach(card => {
      const label = card.querySelector('.overview-card-label')?.textContent?.trim() || '';
      const value = card.querySelector('.overview-card-value')?.textContent?.trim() || '';
      if (label && value) cardData.push([label, value]);
    });

    if (cardData.length > 0) {
      autoTable(pdf, {
        startY: startY,
        head: [['Indicador / KPI', 'Valor consolidado']],
        body: cardData,
        theme: 'grid',
        headStyles: { fillColor: [255, 90, 31], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 3 },
        margin: { top: 26, bottom: 15, left: 8, right: 8 }
      });
      startY = (pdf as any).lastAutoTable.finalY;
    }

    // Extract Tables
    const tables = section.querySelectorAll('.data-table');
    tables.forEach((table, tableIndex) => {
      const head: string[][] = [];
      const body: string[][] = [];

      table.querySelectorAll('thead tr').forEach(tr => {
        const row: string[] = [];
        tr.querySelectorAll('th').forEach(th => row.push(th.textContent?.trim() || ''));
        if (row.length) head.push(row);
      });

      table.querySelectorAll('tbody tr').forEach(tr => {
        const row: string[] = [];
        tr.querySelectorAll('td').forEach(td => row.push(td.textContent?.trim() || ''));
        if (row.length) body.push(row);
      });

      if (head.length || body.length) {
        let tableStartY = (pdf as any).lastAutoTable ? (pdf as any).lastAutoTable.finalY + 10 : startY + 10;

        const titleSpan = table.closest('.chart-card')?.querySelector('.chart-card-title, .detail-section-header');
        const tableTitleText = titleSpan?.textContent?.trim() || `Detalhamento ${tableIndex + 1}`;

        pdf.setFontSize(10);
        pdf.setTextColor(17, 24, 39);
        pdf.setFont('helvetica', 'bold');
        if (tableStartY + 10 > 280) {
          pdf.addPage();
          tableStartY = 26;
        }

        pdf.text(tableTitleText, 8, tableStartY);

        autoTable(pdf, {
          startY: tableStartY + 3,
          head: head.length ? head : undefined,
          body: body,
          theme: 'grid',
          headStyles: { fillColor: [28, 31, 38], textColor: 255 },
          styles: { fontSize: 7, cellPadding: 2.5 },
          margin: { top: 26, bottom: 15, left: 8, right: 8 }
        });
      }
    });

  });

  // Apply Headers to all extra pages generated by autotable
  const totalPages = pdf.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    pdf.setPage(i);
    drawHeader(pdf);
  }

  // Apply Footers at the end
  drawFooter(pdf);

  pdf.save(`GLX_Report_TodosModelos_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.pdf`);
}
