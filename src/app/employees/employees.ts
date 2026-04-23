import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './employees.html',
})
export class EmployeesComponent {
  Math = Math;
  employeeService = inject(EmployeeService);

  // متغيرات الفلترة والبحث
  searchQuery: string = '';
  selectedDepartment: string = 'All';
  selectedStatus: string = 'All';

  // متغيرات الـ Pagination (الصفحات)
  currentPage: number = 1;
  itemsPerPage: number = 6;
  selectedEmployee: any = null;
  showViewModal = false;
  showEditModal = false;
  editForm!: FormGroup;

  private fb = inject(FormBuilder);
  // 1. فانكشن بتجيب الداتا متفلترة
  get filteredEmployees() {
    return this.employeeService.employees().filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesDept =
        this.selectedDepartment === 'All' || emp.department === this.selectedDepartment;
      const matchesStatus = this.selectedStatus === 'All' || emp.status === this.selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }
  // ضيف المتغيرين دول في الكلاس بتاعك
  randomGradient = 'from-[#6b4eff] to-[#a259ff]'; // اللون الافتراضي
  gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-400',
    'from-orange-400 to-rose-400',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-pink-500',
  ];

  // عدل دالة الـ viewEmployee عشان تكون كده:
  viewEmployee(emp: any) {
    this.selectedEmployee = emp;
    // السطر ده بيختار تدرج ألوان عشوائي من المصفوفة
    this.randomGradient = this.gradients[Math.floor(Math.random() * this.gradients.length)];
    this.showViewModal = true;
  }
  editEmployee(emp: any) {
    this.selectedEmployee = emp;
    this.editForm = this.fb.group({
      id: [emp.id],
      name: [emp.name, Validators.required],
      email: [emp.email, [Validators.required, Validators.email]],
      role: [emp.role],
      phone: [emp.phone || '+1 (212) 555-0193'], // داتا وهمية لو مش موجودة
      department: [emp.department],
      location: [emp.location],
      status: [emp.status],
      salary: [emp.salary || '168,000'],
      avatarBg: [emp.avatarBg],
      initials: [emp.initials],
    });
    this.showEditModal = true;
  }
  saveEdit() {
    if (this.editForm.valid) {
      this.employeeService.updateEmployee(this.editForm.value);
      this.closeModals();
    }
  }
  deleteEmp(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
    }
  }
  closeModals() {
    this.showViewModal = false;
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  // 2. فانكشن بتقطع الداتا
  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // 3. حساب عدد الصفحات الإجمالي
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  // 4. تغيير الصفحة
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // 5. الفلترة
  setFilter(type: 'dept' | 'status', value: string) {
    if (type === 'dept') this.selectedDepartment = value;
    if (type === 'status') this.selectedStatus = value;
    this.currentPage = 1;
  }

  // 6. بتجيب أرقام الصفحات اللي هتظهر (أقصى حاجة 3 أرقام)
  // الدالة دي بتحسب الصفحات اللي هتظهر وبتحط النقط في المكان الصح
  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    // لو عدد الصفحات الكلي 3 أو أقل، اعرضهم كلهم من غير نقط
    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // بنحدد بداية ونهاية الـ 3 صفحات اللي هيظهروا
    let start = Math.max(1, current - 1);
    let end = start + 2;

    // بنظبط الحسبة لو وصلنا لآخر الصفحات عشان ميعرضش أرقام بره النطاق
    if (end > total) {
      end = total;
      start = Math.max(1, end - 2);
    }

    const pages: (number | string)[] = [];

    // لو الـ 3 أرقام مش بيبدأوا من صفحة 1، حط نقط في الأول
    if (start > 1) {
      pages.push('...');
    }

    // ضيف الـ 3 أرقام بتوعنا
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // لو لسه في صفحات بعد الرقم الأخير اللي اتعرض، حط نقط في الآخر
    if (end < total) {
      pages.push('...');
    }

    return pages;
  }
}
