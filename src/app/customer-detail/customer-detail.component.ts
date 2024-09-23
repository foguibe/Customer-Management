import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Customer } from '../customer.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent {
  @Input() customer: Customer | null = null;
  @Output() close = new EventEmitter<void>();

  closeOverlay(): void {
    this.close.emit();
  }
}
