import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  employeeService = inject(EmployeeService);

  // --- تفعيل الدارك مود ---
  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // --- كروت الإحصائيات (مربوطة بالداتا الحقيقية) ---
  get stats() {
    const employees = this.employeeService.employees();
    const total = employees.length;
    const active = employees.filter((emp) => emp.status === 'Active').length;

    // هنجيب عدد آخر موظفين اتضافوا كمثال لـ New Hires
    const newHiresCount = employees.slice(-3).length;

    return [
      {
        title: 'Total Employees',
        value: total.toString(),
        increase: '+8%', // دي أرقام تجريبية لحد ما يكون عندك داتا للنسب
        icon: '👥',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
      },
      {
        title: 'Active',
        value: active.toString(),
        increase: '+5%',
        icon: '👤',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
      },
      {
        title: 'New Hires',
        value: newHiresCount.toString(),
        increase: '+12%',
        icon: '✨',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        title: 'Growth Rate',
        value: '14%',
        increase: '+2%',
        icon: '📈',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
      },
    ];
  }

  // --- بيانات الأقسام بالرسم البياني (مربوطة بالداتا الحقيقية) ---
  get departments() {
    const employees = this.employeeService.employees();

    const deptsConfig = [
      { name: 'Product', colorClass: 'bg-purple-500', badgeClass: 'bg-purple-100 text-purple-700' },
      { name: 'Engineering', colorClass: 'bg-blue-600', badgeClass: 'bg-blue-100 text-blue-700' },
      { name: 'Design', colorClass: 'bg-pink-500', badgeClass: 'bg-pink-100 text-pink-700' },
      {
        name: 'Analytics',
        colorClass: 'bg-orange-500',
        badgeClass: 'bg-orange-100 text-orange-700',
      },
      {
        name: 'Marketing',
        colorClass: 'bg-emerald-500',
        badgeClass: 'bg-emerald-100 text-emerald-700',
      },
      { name: 'Sales', colorClass: 'bg-purple-500', badgeClass: 'bg-purple-100 text-purple-700' },
    ];

    // 1. نحسب عدد الموظفين في كل قسم
    let calculatedDepts = deptsConfig.map((dept) => {
      const count = employees.filter((emp) => emp.department === dept.name).length;
      return { ...dept, count: count };
    });

    // 2. نجيب أكبر قسم فيه موظفين عشان ننسب طول الخطوط ليه (عشان الأكبر يملى الخط للآخر)
    const maxCount = Math.max(...calculatedDepts.map((d) => d.count)) || 1;

    // 3. نحسب النسبة المئوية لكل خط ونرتبهم تنازلي (من الكبير للصغير)
    return calculatedDepts
      .map((dept) => ({
        ...dept,
        percentage: Math.round((dept.count / maxCount) * 100),
      }))
      .sort((a, b) => b.count - a.count); // الترتيب التنازلي هنا
  }

  // --- الموظفين الجداد (بيسحب آخر 3 من الداتا الحقيقية) ---
  get recentEmployees() {
    // بناخد آخر 3 ونعكسهم عشان الأجدد يظهر الأول
    return this.employeeService.employees().slice(-3).reverse();
  }

  // --- النشاطات الأخيرة (دي هنسيبها ثابتة زي ما هي لحد ما تعملها Backend/Service) ---
  activities = [
    {
      name: 'Marcus Chen',
      action: 'updated their profile',
      time: '2 min ago',
      dotColor: 'bg-blue-500',
    },
    {
      name: 'Sophia Hartwell',
      action: 'submitted a leave request',
      time: '1 hour ago',
      dotColor: 'bg-indigo-500',
    },
    {
      name: 'Tyler Brooks',
      action: 'joined the Sales team',
      time: '3 hours ago',
      dotColor: 'bg-purple-500',
    },
    {
      name: 'Priya Nair',
      action: 'completed onboarding',
      time: 'Yesterday',
      dotColor: 'bg-pink-500',
    },
    {
      name: 'Elena Vasquez',
      action: 'was promoted to Lead',
      time: '2 days ago',
      dotColor: 'bg-emerald-500',
    },
  ];
}
