import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 1. التعريف الصح للـ Signal
  isLoggedIn = signal<boolean>(false);

  constructor() {
    // 2. أول ما التطبيق يفتح، بنشوف اللوكال ستوريدج عشان لو كان مسجل دخول قبل كده
    const storedStatus = localStorage.getItem('isLoggedIn');
    if (storedStatus === 'true') {
      this.isLoggedIn.set(true); // هنا set هتشتغل زي الفل
    }
  }

  // دالة اللوجن
  login() {
    this.isLoggedIn.set(true);
    localStorage.setItem('isLoggedIn', 'true');
  }

  // دالة تسجيل الخروج (عشان لو احتجتها بعدين)
  logout() {
    this.isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn');
  }
}
