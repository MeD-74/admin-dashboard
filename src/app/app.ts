import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // ضفنا ده عشان الـ *ngIf يشتغل
import { filter } from 'rxjs';

import { SidebarComponent } from './sidebar/sidebar';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  // حطينا CommonModule هنا في الـ imports
  imports: [CommonModule, RouterOutlet, SidebarComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'admin-dashboard';
  isLoginPage = false;

  constructor(private router: Router) {
    // هنا بنراقب اللينك، لو اتغير لـ login بنخلي المتغير true عشان يخفي السايد بار والناف بار
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginPage = event.url.includes('/login');
      });
  }
}
