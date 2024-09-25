import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  picture: string; // This will store the base64-encoded image string
  zipcode: string;
  website: string;
  company: string;
  dateAdded: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private storageKey = 'customers';

  constructor(private http: HttpClient) {}

  // Get all customers from sessionStorage and JSON
  getCustomers(): Observable<Customer[]> {
    return new Observable(observer => {
      const customersFromSessionStorage = this.getCustomersFromSessionStorage();
      this.http.get<Customer[]>('/assets/users.json').subscribe(jsonCustomers => {
        const allCustomers = [...jsonCustomers, ...customersFromSessionStorage];
        observer.next(allCustomers);
        observer.complete();
      });
    });
  }

  // Get all customers from sessionStorage
  private getCustomersFromSessionStorage(): Customer[] {
    if (typeof window !== 'undefined') {
      const customers = sessionStorage.getItem(this.storageKey);
      return customers ? JSON.parse(customers) : [];
    }
    return [];
  }

  // Save customers to sessionStorage
  saveCustomers(customers: Customer[]): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.storageKey, JSON.stringify(customers));
    }
  }

  private nextCustomerId: number = 11;

  // Add a new customer
  addCustomer(customer: Customer): void {
    customer.id = this.nextCustomerId++;
    customer.dateAdded = new Date();
    const customers = this.getCustomersFromSessionStorage();
    customers.push(customer);
    this.saveCustomers(customers);
  }

  // Get a customer by ID
  getCustomerById(id: number): Customer | undefined {
    const customers = this.getCustomersFromSessionStorage();
    return customers.find(c => c.id === id);
  }

  // Upload customer with image compression
  uploadCustomer(customer: Customer, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          const compressedImage = await this.compressImage(base64Image, 0.7); // Adjust the quality as needed
          customer.picture = compressedImage; // Save the compressed base64 image
          this.addCustomer(customer);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  // Compress image using canvas
  private compressImage(imageDataUrl: string, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas not supported');
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality); // Compress as JPEG
        resolve(compressedDataUrl);
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }

  // Update an existing customer
  updateCustomer(updatedCustomer: Customer): void {
    const customers = this.getCustomersFromSessionStorage();
    const index = customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = updatedCustomer;
      this.saveCustomers(customers);
    }
  }

  // Delete a customer by ID
  deleteCustomer(id: number): void {
    const customers = this.getCustomersFromSessionStorage();
    const updatedCustomers = customers.filter(c => c.id !== id);
    this.saveCustomers(updatedCustomers);
  }
}
