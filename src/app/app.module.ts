import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Add this import

@NgModule({
  declarations: [
    AppComponent,
    CustomerListComponent,
    CustomerFormComponent,
    CustomerDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule, // Add CommonModule here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
