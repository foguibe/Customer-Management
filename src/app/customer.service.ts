import { Injectable } from '@angular/core';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  picture: string; // This will store the base64-encoded image string
  dateAdded: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private storageKey = 'customers';

  constructor() { }

  // Get all customers from localStorage
  getCustomers(): Customer[] {
    const customers = localStorage.getItem(this.storageKey);
    return customers ? JSON.parse(customers) : [];
  }

  // Save customers to localStorage
  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(customers));
  }

  // Add a new customer
  addCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    customer.id = customers.length + 1; // Ensure unique ID
    customer.dateAdded = new Date();
    customers.push(customer);
    this.saveCustomers(customers);
  }

  // Get a customer by ID
  getCustomerById(id: number): Customer | undefined {
    const customers = this.getCustomers();
    return customers.find(c => c.id === id); // Return the customer if found
  }

  // Upload customer and compress image
  uploadCustomer(customer: Customer, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        try {
          const compressedImage = await this.compressImage(base64Image);
          customer.picture = compressedImage;
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
  
  // Compress image and return a Promise
  compressImage(image: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100; // Set desired width
        canvas.height = 100; // Set desired height
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL('image/jpeg', 0.5); // Compress image (0.5 is quality)
          resolve(dataURL);
        } else {
          resolve(image); // Fallback if ctx is null
        }
      };
    });
  }

  // Update an existing customer
  updateCustomer(updatedCustomer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = updatedCustomer;
      this.saveCustomers(customers);
    }
  }

  // Delete a customer by ID
  deleteCustomer(id: number): void {
    const customers = this.getCustomers();
    const updatedCustomers = customers.filter(c => c.id !== id);
    this.saveCustomers(updatedCustomers);
  }
}
