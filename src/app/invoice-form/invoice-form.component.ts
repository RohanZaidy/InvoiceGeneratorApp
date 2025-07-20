import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService, InvoiceData, ProjectItem } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h3 class="card-title mb-0">
          <i class="fas fa-file-invoice"></i> Invoice Generator
        </h3>
      </div>
      <div class="card-body">
        <form (ngSubmit)="generateInvoice()" #invoiceForm="ngForm">
          
          <!-- Invoice Info Section -->
          <div class="mb-4">
            <h5 class="text-primary">🧾 Invoice Information</h5>
            <hr>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Invoice Number</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="formData.invoiceNumber" 
                       name="invoiceNumber" readonly>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Invoice Date</label>
                <input type="date" class="form-control" 
                       [(ngModel)]="formData.invoiceDate" 
                       name="invoiceDate" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Due Date</label>
                <input type="date" class="form-control" 
                       [(ngModel)]="formData.dueDate" 
                       name="dueDate" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Project Title / Website Name</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="formData.projectTitle" 
                       name="projectTitle" placeholder="e.g., E-commerce Website Development" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Logo (optional)</label>
                <input type="file" class="form-control" 
                       (change)="onLogoChange($event)" accept="image/*">
              </div>
            </div>
          </div>

          <!-- From Section -->
          <div class="mb-4">
            <h5 class="text-primary">👤 From (Software House Details)</h5>
            <hr>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="formData.companyName" 
                       name="companyName" placeholder="e.g., TechVerse Solutions" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" 
                       [(ngModel)]="formData.companyEmail" 
                       name="companyEmail" required>
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Address</label>
                <textarea class="form-control" 
                          [(ngModel)]="formData.companyAddress" 
                          name="companyAddress" rows="2" required></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-control" 
                       [(ngModel)]="formData.companyPhone" 
                       name="companyPhone" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Website URL (optional)</label>
                <input type="url" class="form-control" 
                       [(ngModel)]="formData.companyWebsite" 
                       name="companyWebsite" placeholder="https://www.example.com">
              </div>
            </div>
          </div>

          <!-- To Section -->
          <div class="mb-4">
            <h5 class="text-primary">👥 To (Client Details)</h5>
            <hr>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Client Full Name</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="formData.clientName" 
                       name="clientName" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Client Company Name (optional)</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="formData.clientCompany" 
                       name="clientCompany">
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Client Address</label>
                <textarea class="form-control" 
                          [(ngModel)]="formData.clientAddress" 
                          name="clientAddress" rows="2" required></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Client Email</label>
                <input type="email" class="form-control" 
                       [(ngModel)]="formData.clientEmail" 
                       name="clientEmail" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Client Phone</label>
                <input type="tel" class="form-control" 
                       [(ngModel)]="formData.clientPhone" 
                       name="clientPhone" required>
              </div>
            </div>
          </div>

          <!-- Project Items Section -->
          <div class="mb-4">
            <h5 class="text-primary">📦 Project/Service Items</h5>
            <hr>
            <div *ngFor="let item of formData.items; let i = index" class="border p-3 mb-3 rounded">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Item #{{i + 1}}</h6>
                <button type="button" class="btn btn-sm btn-danger" 
                        (click)="removeItem(i)" *ngIf="formData.items.length > 1">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Description</label>
                  <input type="text" class="form-control" 
                         [(ngModel)]="item.description" 
                         [name]="'description_' + i" 
                         placeholder="e.g., Frontend UI Design" required>
                </div>
                <div class="col-md-2 mb-3">
                  <label class="form-label">Hours</label>
                  <input type="number" class="form-control" 
                         [(ngModel)]="item.hours" 
                         [name]="'hours_' + i" 
                         (ngModelChange)="calculateItemTotal(i)" 
                         min="0" step="0.5" required>
                </div>
                <div class="col-md-2 mb-3">
                  <label class="form-label">Rate/Hour ($)</label>
                  <input type="number" class="form-control" 
                         [(ngModel)]="item.ratePerHour" 
                         [name]="'rate_' + i" 
                         (ngModelChange)="calculateItemTotal(i)" 
                         min="0" step="0.01" required>
                </div>
                <div class="col-md-2 mb-3">
                  <label class="form-label">Total ($)</label>
                  <input type="number" class="form-control" 
                         [value]="item.total" readonly>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-outline-primary" (click)="addItem()">
              <i class="fas fa-plus"></i> Add Item
            </button>
          </div>

          <!-- Totals Section -->
          <div class="mb-4">
            <h5 class="text-primary">💰 Totals</h5>
            <hr>
            <div class="row">
              <div class="col-md-3 mb-3">
                <label class="form-label">Discount (%)</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="formData.discount" 
                       name="discount" 
                       (ngModelChange)="calculateTotals()" 
                       min="0" max="100" step="0.01">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Tax (%)</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="formData.taxPercentage" 
                       name="taxPercentage" 
                       (ngModelChange)="calculateTotals()" 
                       min="0" max="100" step="0.01">
              </div>
              <div class="col-md-6">
                <div class="bg-light p-3 rounded">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>\${{formData.subtotal.toFixed(2)}}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2" *ngIf="formData.discount > 0">
                    <span>Discount ({{formData.discount}}%):</span>
                    <span>-\${{(formData.subtotal * formData.discount / 100).toFixed(2)}}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2" *ngIf="formData.taxPercentage > 0">
                    <span>Tax ({{formData.taxPercentage}}%):</span>
                    <span>\${{formData.taxAmount.toFixed(2)}}</span>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between fw-bold">
                    <span>Grand Total:</span>
                    <span>\${{formData.grandTotal.toFixed(2)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-success btn-lg" [disabled]="!invoiceForm.form.valid">
              <i class="fas fa-file-alt"></i> Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .border {
      border: 1px solid #dee2e6 !important;
    }
    .bg-light {
      background-color: #f8f9fa !important;
    }
  `]
})
export class InvoiceFormComponent {
  @Output() invoiceGenerated = new EventEmitter<InvoiceData>();

  formData: InvoiceData = {
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    projectTitle: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    clientName: '',
    clientCompany: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    items: [{
      description: '',
      hours: 0,
      ratePerHour: 0,
      total: 0
    }],
    subtotal: 0,
    discount: 0,
    taxPercentage: 0,
    taxAmount: 0,
    grandTotal: 0
  };

  constructor(private invoiceService: InvoiceService) {
    this.formData.invoiceNumber = this.invoiceService.generateInvoiceNumber();
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    this.formData.dueDate = dueDate.toISOString().split('T')[0];
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.logo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addItem() {
    this.formData.items.push({
      description: '',
      hours: 0,
      ratePerHour: 0,
      total: 0
    });
  }

  removeItem(index: number) {
    this.formData.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateItemTotal(index: number) {
    const item = this.formData.items[index];
    item.total = item.hours * item.ratePerHour;
    this.calculateTotals();
  }

  calculateTotals() {
    this.formData.subtotal = this.formData.items.reduce((sum, item) => sum + item.total, 0);
    
    const discountAmount = this.formData.subtotal * (this.formData.discount / 100);
    const afterDiscount = this.formData.subtotal - discountAmount;
    
    this.formData.taxAmount = afterDiscount * (this.formData.taxPercentage / 100);
    this.formData.grandTotal = afterDiscount + this.formData.taxAmount;
  }

  generateInvoice() {
    this.calculateTotals();
    this.invoiceGenerated.emit({ ...this.formData });
  }
}