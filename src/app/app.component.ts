import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { InvoiceService, InvoiceData } from './services/invoice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InvoiceFormComponent, InvoicePreviewComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6">
          <app-invoice-form 
            (invoiceGenerated)="onInvoiceGenerated($event)">
          </app-invoice-form>
        </div>
        <div class="col-lg-6">
          <app-invoice-preview 
            [invoiceData]="currentInvoice">
          </app-invoice-preview>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  currentInvoice: InvoiceData | null = null;

  constructor(private invoiceService: InvoiceService) {}

  onInvoiceGenerated(invoiceData: InvoiceData) {
    this.currentInvoice = invoiceData;
    this.invoiceService.setCurrentInvoice(invoiceData);
  }
}