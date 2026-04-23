import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- ضفنا الـ Router
import { DarkModeService } from '../services/dark-mode';
import { AuthService } from '../services/auth'; // <-- ضفنا الـ AuthService بتاعك

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  showError = false;

  public darkModeService = inject(DarkModeService);
  private router = inject(Router); // <-- حقن الـ Router
  private authService = inject(AuthService); // <-- حقن الـ AuthService

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.showError = false;

      // بنستدعي دالة اللوجن من السيرفيس
      this.authService.login();

      // وبننقله للداش بورد
      this.router.navigate(['/dashboard']);
    } else {
      this.showError = true;
    }
  }
}
