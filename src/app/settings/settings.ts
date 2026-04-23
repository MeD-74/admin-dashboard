import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
})
export class SettingsComponent {
  profileForm: FormGroup;
  securityForm: FormGroup;

  activeTab = 'Billing'; // هيفتح على البيلنج علطول عشان تشوف الجديد
  isDarkMode = false;
  is2FAEnabled = true;

  notifications = {
    email: true,
    push: true,
    weekly: false,
  };

  activeSessions = [
    { device: 'MacBook Pro - Safari', location: 'San Francisco, CA - Active now', isCurrent: true },
    {
      device: 'iPhone 15 - Mobile App',
      location: 'San Francisco, CA - 2 hours ago',
      isCurrent: false,
    },
    { device: 'Windows - Chrome', location: 'New York, NY - Yesterday', isCurrent: false },
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['Admin User'],
      email: ['admin@company.com'],
      jobTitle: ['Super Administrator'],
      phone: ['+1 (415) 555-0100'],
    });

    this.securityForm = this.fb.group({
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggle2FA() {
    this.is2FAEnabled = !this.is2FAEnabled;
  }

  toggleNotification(type: 'email' | 'push' | 'weekly') {
    this.notifications[type] = !this.notifications[type];
  }

  onProfileSubmit() {
    console.log('Profile Saved:', this.profileForm.value);
  }

  onSecuritySubmit() {
    console.log('Password Updated:', this.securityForm.value);
    this.securityForm.reset();
  }
}
