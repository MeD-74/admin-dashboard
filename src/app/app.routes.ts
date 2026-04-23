import { Routes, Router } from '@angular/router';
import { LoginComponent } from './login/login';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

// السطر ده مهم جداً: لازم الكلمة تكون routes
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'employees',
        loadComponent: () => import('./employees/employees').then((m) => m.EmployeesComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then((m) => m.SettingsComponent),
      },
      {
        path: 'add-employee',
        loadComponent: () =>
          import('./add-employee/add-employee').then((m) => m.AddEmployeeComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
