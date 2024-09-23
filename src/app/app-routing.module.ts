import { provideRouter, Route } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

const routes: Route[] = [
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id', component: CustomerListComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' as const },
];

export const appRoutes = provideRouter(routes);
