import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProjectItem {
  description: string;
  hours: number;
  ratePerHour: number;
  total: number;
}

export interface InvoiceData {
  // Invoice Info
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  projectTitle: string;
  logo?: string;
  
  // From (Software House Details)
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite?: string;
  
  // To (Client Details)
  clientName: string;
  clientCompany?: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  
  // Project Items
  items: ProjectItem[];
  
  // Totals
  subtotal: number;
  discount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoiceSubject = new BehaviorSubject<InvoiceData | null>(null);
  invoice$ = this.invoiceSubject.asObservable();

  setCurrentInvoice(invoice: InvoiceData) {
    this.invoiceSubject.next(invoice);
  }

  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  }
}