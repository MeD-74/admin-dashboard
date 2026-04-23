import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  authService = inject(AuthService); // ضيف السطر ده هنا
  private router = inject(Router);
  onSignOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
