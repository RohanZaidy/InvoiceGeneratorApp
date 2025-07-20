import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceData } from '../services/invoice.service';

declare var jsPDF: any;

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" *ngIf="invoiceData">
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0">
          <i class="fas fa-eye"></i> Invoice Preview
        </h3>
        <button class="btn btn-light" (click)="downloadPDF()" [disabled]="!invoiceData">
          <i class="fas fa-download"></i> Download PDF
        </button>
      </div>
      <div class="card-body p-0">
        <div id="invoice-content" class="p-4">
          <!-- Invoice Header -->
          <div class="row mb-4">
            <div class="col-md-6">
              <img *ngIf="invoiceData.logo" [src]="invoiceData.logo" 
                   class="img-fluid mb-2" style="max-height: 80px;">
              <h2 class="text-primary">{{invoiceData.companyName}}</h2>
              <div class="text-muted">
                <div>{{invoiceData.companyAddress}}</div>
                <div>{{invoiceData.companyEmail}}</div>
                <div>{{invoiceData.companyPhone}}</div>
                <div *ngIf="invoiceData.companyWebsite">{{invoiceData.companyWebsite}}</div>
              </div>
            </div>
            <div class="col-md-6 text-end">
              <h1 class="display-4 text-primary">INVOICE</h1>
              <div class="mb-2">
                <strong>Invoice #:</strong> {{invoiceData.invoiceNumber}}
              </div>
              <div class="mb-2">
                <strong>Date:</strong> {{invoiceData.invoiceDate | date:'mediumDate'}}
              </div>
              <div class="mb-2">
                <strong>Due Date:</strong> {{invoiceData.dueDate | date:'mediumDate'}}
              </div>
            </div>
          </div>

          <!-- Project Title -->
          <div class="mb-4">
            <h4 class="text-primary border-bottom pb-2">{{invoiceData.projectTitle}}</h4>
          </div>

          <!-- Bill To Section -->
          <div class="row mb-4">
            <div class="col-md-6">
              <h5 class="text-primary">Bill To:</h5>
              <div>
                <strong>{{invoiceData.clientName}}</strong>
                <div *ngIf="invoiceData.clientCompany" class="text-muted">{{invoiceData.clientCompany}}</div>
                <div class="text-muted mt-2">{{invoiceData.clientAddress}}</div>
                <div class="text-muted">{{invoiceData.clientEmail}}</div>
                <div class="text-muted">{{invoiceData.clientPhone}}</div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="table-responsive mb-4">
            <table class="table table-bordered">
              <thead class="table-primary">
                <tr>
                  <th>Description</th>
                  <th class="text-center">Hours</th>
                  <th class="text-center">Rate/Hour</th>
                  <th class="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of invoiceData.items">
                  <td>{{item.description}}</td>
                  <td class="text-center">{{item.hours}}</td>
                  <td class="text-center">\${{item.ratePerHour.toFixed(2)}}</td>
                  <td class="text-end">\${{item.total.toFixed(2)}}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="row">
            <div class="col-md-6"></div>
            <div class="col-md-6">
              <table class="table">
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td class="text-end">\${{invoiceData.subtotal.toFixed(2)}}</td>
                </tr>
                <tr *ngIf="invoiceData.discount > 0">
                  <td><strong>Discount ({{invoiceData.discount}}%):</strong></td>
                  <td class="text-end">-\${{(invoiceData.subtotal * invoiceData.discount / 100).toFixed(2)}}</td>
                </tr>
                <tr *ngIf="invoiceData.taxPercentage > 0">
                  <td><strong>Tax ({{invoiceData.taxPercentage}}%):</strong></td>
                  <td class="text-end">\${{invoiceData.taxAmount.toFixed(2)}}</td>
                </tr>
                <tr class="table-success">
                  <td><strong>Grand Total:</strong></td>
                  <td class="text-end"><strong>\${{invoiceData.grandTotal.toFixed(2)}}</strong></td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-5 pt-4 border-top">
            <p class="text-muted text-center">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Placeholder when no invoice -->
    <div class="card" *ngIf="!invoiceData">
      <div class="card-body text-center py-5">
        <i class="fas fa-file-invoice fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No invoice generated yet</h5>
        <p class="text-muted">Fill out the form and click "Generate Invoice" to see the preview</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    #invoice-content {
      background: white;
    }
    
    @media print {
      .card-header {
        display: none !important;
      }
      
      .card {
        box-shadow: none !important;
        border: none !important;
      }
    }
    
    .table th {
      background-color: #0d6efd !important;
      color: white !important;
    }
  `]
})
export class InvoicePreviewComponent implements OnChanges {
  @Input() invoiceData: InvoiceData | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoiceData'] && this.invoiceData) {
      
    }
  }

  downloadPDF() {
    if (!this.invoiceData) return;

    // Alternative approach: Use HTML to Canvas to PDF
    this.generatePDFAlternative();
  }

  private generatePDFAlternative() {
    // Simple text-based PDF generation
    // const invoiceContent = this.generateInvoiceText();
    
    // Create a blob with the invoice content
    // const blob = new Blob([invoiceContent], { type: 'text/plain' });
    
    // Create download link
    // const url = window.URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = `Invoice-${this.invoiceData!.invoiceNumber}.txt`;
    
    // // Trigger download
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // window.URL.revokeObjectURL(url);
    
    // Also try the original PDF method
    this.generatePDF();
  }

  // private generateInvoiceText(): string {
  //   const invoice = this.invoiceData!;
  //   let content = '';
    
  //   content += '='.repeat(60) + '\n';
  //   content += `                    INVOICE\n`;
  //   content += '='.repeat(60) + '\n\n';
    
  //   content += `${invoice.companyName}\n`;
  //   content += `${invoice.companyAddress}\n`;
  //   content += `${invoice.companyEmail} | ${invoice.companyPhone}\n`;
  //   if (invoice.companyWebsite) content += `${invoice.companyWebsite}\n`;
  //   content += '\n';
    
  //   content += `Invoice #: ${invoice.invoiceNumber}\n`;
  //   content += `Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}\n`;
  //   content += `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n`;
  //   content += `Project: ${invoice.projectTitle}\n\n`;
    
  //   content += 'BILL TO:\n';
  //   content += `${invoice.clientName}\n`;
  //   if (invoice.clientCompany) content += `${invoice.clientCompany}\n`;
  //   content += `${invoice.clientAddress}\n`;
  //   content += `${invoice.clientEmail} | ${invoice.clientPhone}\n\n`;
    
  //   content += 'SERVICES:\n';
  //   content += '-'.repeat(60) + '\n';
  //   content += 'Description'.padEnd(30) + 'Hours'.padEnd(8) + 'Rate'.padEnd(10) + 'Total\n';
  //   content += '-'.repeat(60) + '\n';
    
  //   invoice.items.forEach(item => {
  //     const desc = item.description.length > 28 ? item.description.substring(0, 28) + '..' : item.description;
  //     content += desc.padEnd(30) + 
  //                item.hours.toString().padEnd(8) + 
  //                `${item.ratePerHour.toFixed(2)}`.padEnd(10) + 
  //                `${item.total.toFixed(2)}\n`;
  //   });
    
  //   content += '-'.repeat(60) + '\n';
  //   content += `Subtotal: ${invoice.subtotal.toFixed(2)}\n`;
    
  //   if (invoice.discount > 0) {
  //     const discountAmount = invoice.subtotal * invoice.discount / 100;
  //     content += `Discount (${invoice.discount}%): -${discountAmount.toFixed(2)}\n`;
  //   }
    
  //   if (invoice.taxPercentage > 0) {
  //     content += `Tax (${invoice.taxPercentage}%): ${invoice.taxAmount.toFixed(2)}\n`;
  //   }
    
  //   content += `GRAND TOTAL: ${invoice.grandTotal.toFixed(2)}\n`;
  //   content += '='.repeat(60) + '\n\n';
  //   content += 'Thank you for your business!\n';
    
  //   return content;
  // }

  private generatePDF() {
  const jsPDFLib = (window as any).jspdf?.jsPDF || (window as any).jsPDF;

  if (!jsPDFLib) {
    console.log('jsPDF not available, text file downloaded instead');
    return;
  }

  try {
    const pdf = new jsPDFLib();

    let yPosition = 20;

    // ✅ ADD LOGO IMAGE IF EXISTS
    if (this.invoiceData!.logo) {
      const logoDataUrl = this.invoiceData!.logo;

      // Add image: imageData, type, x, y, width, height
      pdf.addImage(logoDataUrl, 'PNG', 150, 10, 40, 20); // Adjust position/size as needed
    }

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(13, 110, 253);
    pdf.text(this.invoiceData!.companyName, 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(24);
    pdf.text('INVOICE', 20, yPosition);

    yPosition += 15;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Company details
    const companyLines = [
      this.invoiceData!.companyAddress,
      this.invoiceData!.companyEmail,
      this.invoiceData!.companyPhone,
      this.invoiceData!.companyWebsite || ''
    ].filter(line => line);

    companyLines.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 5;
    });

    // Invoice details (right side)
    let invoiceDetailY = 40;
    pdf.text(`Invoice #: ${this.invoiceData!.invoiceNumber}`, 150, invoiceDetailY);
    invoiceDetailY += 7;
    pdf.text(`Date: ${new Date(this.invoiceData!.invoiceDate).toLocaleDateString()}`, 150, invoiceDetailY);
    invoiceDetailY += 7;
    pdf.text(`Due Date: ${new Date(this.invoiceData!.dueDate).toLocaleDateString()}`, 150, invoiceDetailY);

    // Project title
    yPosition += 20;
    pdf.setFontSize(14);
    pdf.setTextColor(13, 110, 253);
    pdf.text(`Project: ${this.invoiceData!.projectTitle}`, 20, yPosition);

    // Client details
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.text('Bill To:', 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(this.invoiceData!.clientName, 20, yPosition);
    yPosition += 5;

    if (this.invoiceData!.clientCompany) {
      pdf.text(this.invoiceData!.clientCompany, 20, yPosition);
      yPosition += 5;
    }

    pdf.text(this.invoiceData!.clientAddress, 20, yPosition);
    yPosition += 5;
    pdf.text(this.invoiceData!.clientEmail, 20, yPosition);
    yPosition += 5;
    pdf.text(this.invoiceData!.clientPhone, 20, yPosition);

    // Items table
    yPosition += 20;
    const tableTop = yPosition;

    // Table headers
    pdf.setFontSize(10);
    pdf.setFillColor(13, 110, 253);
    pdf.rect(20, yPosition - 5, 170, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Description', 25, yPosition);
    pdf.text('Hours', 110, yPosition);
    pdf.text('Rate/Hour', 130, yPosition);
    pdf.text('Amount', 160, yPosition);

    yPosition += 10;
    pdf.setTextColor(0, 0, 0);

    // Table rows
    this.invoiceData!.items.forEach(item => {
      pdf.text(item.description, 25, yPosition);
      pdf.text(item.hours.toString(), 110, yPosition);
      pdf.text(`$${item.ratePerHour.toFixed(2)}`, 130, yPosition);
      pdf.text(`$${item.total.toFixed(2)}`, 160, yPosition);
      yPosition += 7;
    });

    // Totals
    yPosition += 10;
    const totalsX = 130;

    pdf.text('Subtotal:', totalsX, yPosition);
    pdf.text(`$${this.invoiceData!.subtotal.toFixed(2)}`, 170, yPosition);
    yPosition += 7;

    if (this.invoiceData!.discount > 0) {
      const discountAmount = this.invoiceData!.subtotal * this.invoiceData!.discount / 100;
      pdf.text(`Discount (${this.invoiceData!.discount}%):`, totalsX, yPosition);
      pdf.text(`-$${discountAmount.toFixed(2)}`, 170, yPosition);
      yPosition += 7;
    }

    if (this.invoiceData!.taxPercentage > 0) {
      pdf.text(`Tax (${this.invoiceData!.taxPercentage}%):`, totalsX, yPosition);
      pdf.text(`${this.invoiceData!.taxAmount.toFixed(2)}`, 170, yPosition);
      yPosition += 7;
    }

    // Grand total
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Grand Total:', totalsX, yPosition);
    pdf.text(`${this.invoiceData!.grandTotal.toFixed(2)}`, 170, yPosition);

    // Footer
    yPosition += 20;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text('Thank you for your business!', 105, yPosition, { align: 'center' });

    // Save the PDF
    pdf.save(`Invoice-${this.invoiceData!.invoiceNumber}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

}