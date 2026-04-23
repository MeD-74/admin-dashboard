import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employees.html',
})
export class EmployeesComponent {
  employeeService = inject(EmployeeService); // استدعاء الـ Service

  // متغيرات الفلترة والبحث
  searchQuery: string = '';
  selectedDepartment: string = 'All';
  selectedStatus: string = 'All';

  // متغيرات الـ Pagination (الصفحات)
  currentPage: number = 1;
  itemsPerPage: number = 6; // أقصى عدد 6 زي ما طلبت

  // 1. فانكشن بتجيب الداتا متفلترة (بحث + قسم + حالة)
  get filteredEmployees() {
    return this.employeeService.employees().filter((emp) => {
      // فلتر البحث (بالاسم)
      const matchesSearch = emp.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      // فلتر القسم
      const matchesDept =
        this.selectedDepartment === 'All' || emp.department === this.selectedDepartment;
      // فلتر الحالة
      const matchesStatus = this.selectedStatus === 'All' || emp.status === this.selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }

  // 2. فانكشن بتقطع الداتا المتفلترة على حسب إحنا في صفحة كام
  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // حساب عدد الصفحات الإجمالي
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  // تغيير الصفحة
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // تغيير الفلتر بيرجعك للصفحة الأولى عشان الداتا متضربش
  setFilter(type: 'dept' | 'status', value: string) {
    if (type === 'dept') this.selectedDepartment = value;
    if (type === 'status') this.selectedStatus = value;
    this.currentPage = 1;
  }
}
