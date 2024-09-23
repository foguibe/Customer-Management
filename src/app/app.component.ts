import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],  // Add FormsModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrected styleUrl to styleUrls
})
export class AppComponent {
  title = 'customer-management';
}
