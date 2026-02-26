import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

// Export data to CSV
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export report to PDF
export function exportToPDF(
  title: string,
  subtitle: string,
  kpis: { label: string; value: string; trend?: string }[],
  tableData?: { headers: string[]; rows: (string | number)[][] },
  filename?: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo text
  doc.setTextColor(255, 140, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GLX', 14, 20);
  doc.setTextColor(255, 255, 255);
  doc.text(' PARTNERS', 35, 20);
  
  // Title
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 14, 32);
  
  // Subtitle and date
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(subtitle, 14, 50);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth - 14, 50, { align: 'right' });
  
  // KPIs Section
  let yPos = 65;
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Indicadores Principais', 14, yPos);
  
  yPos += 10;
  const kpiWidth = (pageWidth - 28) / Math.min(kpis.length, 4);
  
  kpis.slice(0, 4).forEach((kpi, index) => {
    const xPos = 14 + (index * kpiWidth);
    
    // KPI Box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(xPos, yPos, kpiWidth - 5, 25, 3, 3, 'F');
    
    // KPI Label
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(kpi.label, xPos + 5, yPos + 8);
    
    // KPI Value
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.value, xPos + 5, yPos + 18);
    
    // Trend
    if (kpi.trend) {
      doc.setFontSize(8);
      const isPositive = kpi.trend.startsWith('+');
      doc.setTextColor(isPositive ? 34 : 220, isPositive ? 197 : 38, isPositive ? 94 : 38);
      doc.text(kpi.trend, xPos + kpiWidth - 20, yPos + 18);
    }
  });
  
  yPos += 35;
  
  // Additional KPIs if more than 4
  if (kpis.length > 4) {
    kpis.slice(4, 8).forEach((kpi, index) => {
      const xPos = 14 + (index * kpiWidth);
      
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(xPos, yPos, kpiWidth - 5, 25, 3, 3, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(kpi.label, xPos + 5, yPos + 8);
      
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(kpi.value, xPos + 5, yPos + 18);
      
      if (kpi.trend) {
        doc.setFontSize(8);
        const isPositive = kpi.trend.startsWith('+');
        doc.setTextColor(isPositive ? 34 : 220, isPositive ? 197 : 38, isPositive ? 94 : 38);
        doc.text(kpi.trend, xPos + kpiWidth - 20, yPos + 18);
      }
    });
    yPos += 35;
  }
  
  // Table Section
  if (tableData && tableData.rows.length > 0) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados Detalhados', 14, yPos);
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [tableData.headers],
      body: tableData.rows,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 140, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `GLX Partners - Relatório Confidencial | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`${filename || title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

// Lean Six Sigma Calculations
export const leanSixSigma = {
  // Calculate Sigma Level from defect rate
  calculateSigmaLevel(defectRate: number): number {
    if (defectRate <= 0) return 6;
    if (defectRate >= 1) return 0;
    // Simplified sigma calculation
    const z = -Math.log(defectRate) / Math.log(10) * 1.5;
    return Math.min(6, Math.max(0, z + 1.5));
  },
  
  // Calculate DPMO (Defects Per Million Opportunities)
  calculateDPMO(defects: number, opportunities: number): number {
    if (opportunities === 0) return 0;
    return Math.round((defects / opportunities) * 1000000);
  },
  
  // Calculate Process Capability (Cp)
  calculateCp(usl: number, lsl: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (usl - lsl) / (6 * stdDev);
  },
  
  // Calculate Process Capability Index (Cpk)
  calculateCpk(mean: number, usl: number, lsl: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    const cpu = (usl - mean) / (3 * stdDev);
    const cpl = (mean - lsl) / (3 * stdDev);
    return Math.min(cpu, cpl);
  },
  
  // Calculate OEE (Overall Equipment Effectiveness)
  calculateOEE(availability: number, performance: number, quality: number): number {
    return availability * performance * quality;
  },
  
  // Calculate Yield
  calculateYield(totalUnits: number, defects: number): number {
    if (totalUnits === 0) return 0;
    return ((totalUnits - defects) / totalUnits) * 100;
  },
  
  // Get Sigma Level description
  getSigmaDescription(sigma: number): { level: string; color: string } {
    if (sigma >= 6) return { level: 'World Class', color: '#22c55e' };
    if (sigma >= 5) return { level: 'Excellent', color: '#84cc16' };
    if (sigma >= 4) return { level: 'Good', color: '#eab308' };
    if (sigma >= 3) return { level: 'Average', color: '#f97316' };
    if (sigma >= 2) return { level: 'Below Average', color: '#ef4444' };
    return { level: 'Poor', color: '#dc2626' };
  },
};

// Format currency
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Format number with K/M suffix
export function formatCompactNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

// Calculate trend percentage
export function calculateTrend(current: number, previous: number): { value: string; isPositive: boolean } {
  if (previous === 0) return { value: '+0%', isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    isPositive: change >= 0,
  };
}
