import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService, Customer } from '../customer.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {
  @Input() customer: Customer = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    zipcode: '',
    gender: 'male',
    website: '',
    company: '',
    picture: '',
    dateAdded: new Date()
  };

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void { }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Set image preview
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }  

  removeFile() {
    this.selectedFile = null; // Reset the selected file
    this.imagePreview = null; // Reset the image preview to remove the displayed image
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input value
    }
  }  

  onSubmit(): void {
    if (this.selectedFile) {
      // Handle upload with the selected file
      this.customerService.uploadCustomer(this.customer, this.selectedFile)
        .then(() => {
          // Once the image upload is done, save or update the customer
          this.saveOrUpdateCustomer();
        })
        .catch(error => {
          console.error("Upload failed", error);
        });
    } else {
      // Handle submission without a file
      this.saveOrUpdateCustomer();
    }
  }
  
  saveOrUpdateCustomer(): void {
    if (this.customer.id) {
      this.customerService.updateCustomer(this.customer);
    } else {
      this.customerService.addCustomer(this.customer);
    }
    this.router.navigate(['/customers']);
  }  

}
