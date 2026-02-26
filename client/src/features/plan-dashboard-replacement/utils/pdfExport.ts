import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const OKLCH_REGEX = /oklch\([^)]+\)/gi;

function convertCssColorToRgb(color: string, doc: Document): string {
  const probe = doc.createElement("span");
  probe.style.color = "";
  probe.style.color = color;
  if (!probe.style.color) return color;
  doc.body.appendChild(probe);
  const computed = doc.defaultView?.getComputedStyle(probe).color || color;
  probe.remove();
  return computed;
}

function sanitizeUnsupportedColorsForHtml2Canvas(doc: Document) {
  const convertToken = (token: string) => convertCssColorToRgb(token, doc);

  doc.querySelectorAll("style").forEach((styleEl) => {
    const cssText = styleEl.textContent;
    if (!cssText || !cssText.toLowerCase().includes("oklch(")) return;
    styleEl.textContent = cssText.replace(OKLCH_REGEX, convertToken);
  });

  doc.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const styleAttr = el.getAttribute("style");
    if (!styleAttr || !styleAttr.toLowerCase().includes("oklch(")) return;
    el.setAttribute("style", styleAttr.replace(OKLCH_REGEX, convertToken));
  });
}

/**
 * Professional PDF export for stakeholder/investor presentations.
 * Captures the current dashboard view with branding header and footer.
 */
export async function exportDashboardPDF(
  contentElement: HTMLElement,
  title: string,
  subtitle: string,
): Promise<void> {
  if (!contentElement) return;

  const dashboardRoot = contentElement.closest('.glx-plan-dashboard-root') as HTMLElement | null;
  const themeTarget = dashboardRoot ?? document.documentElement;
  const originalBg = themeTarget.getAttribute('data-theme');
  themeTarget.setAttribute('data-theme', 'light');

  // Wait for theme transition and chart re-render
  await new Promise(r => setTimeout(r, 600));

  try {
    const canvas = await html2canvas(contentElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: contentElement.scrollWidth,
      windowHeight: contentElement.scrollHeight,
      onclone: (clonedDoc) => {
        sanitizeUnsupportedColorsForHtml2Canvas(clonedDoc);
      },
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const headerHeight = 22;
    const footerHeight = 12;
    const contentAreaHeight = pageHeight - headerHeight - footerHeight;
    const margin = 8;

    const imgData = canvas.toDataURL('image/png');
    const imgAspectRatio = canvas.width / canvas.height;
    const printableWidth = imgWidth - margin * 2;
    const scaledHeight = printableWidth / imgAspectRatio;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const totalPages = Math.ceil(scaledHeight / contentAreaHeight);
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      // ---- HEADER ----
      // Orange accent bar
      pdf.setFillColor(255, 90, 31);
      pdf.rect(0, 0, 210, 3, 'F');

      // Logo area
      pdf.setFillColor(255, 90, 31);
      pdf.roundedRect(margin, 6, 12, 10, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text('GLX', margin + 6, 12.5, { align: 'center' });

      // Title
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 15, 10);

      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(subtitle, margin + 15, 14.5);

      // Date + page on right
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(7);
      pdf.text(dateStr, imgWidth - margin, 10, { align: 'right' });
      pdf.text(`Página ${page + 1} de ${totalPages}`, imgWidth - margin, 14, { align: 'right' });

      // Header divider
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.3);
      pdf.line(margin, headerHeight - 2, imgWidth - margin, headerHeight - 2);

      // ---- CONTENT ----
      const srcY = page * contentAreaHeight;
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        headerHeight,
        printableWidth,
        scaledHeight,
        undefined,
        'FAST',
        0,
      );

      // Clip to current page
      if (page > 0) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, imgWidth, headerHeight, 'F');
        // Re-draw header
        pdf.setFillColor(255, 90, 31);
        pdf.rect(0, 0, 210, 3, 'F');
        pdf.setFillColor(255, 90, 31);
        pdf.roundedRect(margin, 6, 12, 10, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GLX', margin + 6, 12.5, { align: 'center' });
        pdf.setTextColor(17, 24, 39);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 15, 10);
        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(subtitle, margin + 15, 14.5);
        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(7);
        pdf.text(dateStr, imgWidth - margin, 10, { align: 'right' });
        pdf.text(`Página ${page + 1} de ${totalPages}`, imgWidth - margin, 14, { align: 'right' });
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.3);
        pdf.line(margin, headerHeight - 2, imgWidth - margin, headerHeight - 2);
      }

      // ---- FOOTER ----
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.3);
      pdf.line(margin, pageHeight - footerHeight, imgWidth - margin, pageHeight - footerHeight);

      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('GLX Performance Control Tower — Confidencial', margin, pageHeight - 6);
      pdf.text('© 2026 GLX Partners. Todos os direitos reservados.', imgWidth - margin, pageHeight - 6, { align: 'right' });
    }

    pdf.save(`GLX_Report_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.pdf`);
  } finally {
    // Restore original theme
    if (originalBg) {
      themeTarget.setAttribute('data-theme', originalBg);
    } else if (themeTarget !== document.documentElement) {
      themeTarget.removeAttribute('data-theme');
    }
  }
}
