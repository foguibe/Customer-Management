import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  imports: [CustomerDetailComponent, FormsModule, CommonModule, HttpClientModule]
})

export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  filterGender: string = '';
  startDate: string = '';
  endDate: string = '';
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  
  // New properties for table formatting
  tableFontSize: number = 14;  // Default font size is 14px
  textAlign: string = 'left';  // Default alignment is 'left'

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filterCustomers();
    });

    // Check if there's a customer ID in the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.viewCustomerById(+id); // Call the method with the ID
    }
  }

  filterCustomers(): void {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = this.searchTerm
        ? customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.phone.includes(this.searchTerm) ||
          customer.address.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesGender = this.filterGender
        ? customer.gender === this.filterGender
        : true;

      const matchesDate = (this.startDate && this.endDate)
        ? new Date(customer.dateAdded) >= new Date(this.startDate) &&
          new Date(customer.dateAdded) <= new Date(this.endDate)
        : true;

      return matchesSearch && matchesGender && matchesDate;
    });
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id);
    this.customers = this.customers.filter(customer => customer.id !== id);
    this.filterCustomers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterGender = '';
    this.startDate = '';
    this.endDate = '';
    this.filterCustomers(); // Refresh the displayed customers
  }

  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  closeOverlay(): void {
    this.selectedCustomer = null;
    this.router.navigate(['/customers']); // Navigate back to the customer list
  }

  viewCustomerById(id: number): void {
    const customer = this.customers.find(c => c.id === id);
    if (customer) {
      this.viewCustomer(customer);
    }
  }

  editCustomer(customer: Customer): void {
    // Logic for editing the customer
  }

  addCustomer(): void {
    this.router.navigate(['/customers/new']);
  }
}
