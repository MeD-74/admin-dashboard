import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.html'
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  employeeService = inject(EmployeeService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      jobTitle: [''],
      department: ['Engineering'],
      status: ['Active'],
      joinDate: [''],
      location: [''],
      salary: ['']
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formVal = this.employeeForm.value;
      
      const newEmployee = {
        id: '#' + Math.floor(Math.random() * 900 + 100),
        initials: formVal.fullName.substring(0, 2).toUpperCase(),
        avatarBg: 'bg-indigo-500',
        name: formVal.fullName,
        role: formVal.jobTitle,
        email: formVal.email,
        department: formVal.department,
        location: formVal.location || 'N/A',
        status: formVal.status
      };

      this.employeeService.addEmployee(newEmployee);
      this.router.navigate(['/employees']);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
  // المتغير اللي هيحفظ رابط الصورة عشان تتعرض
  profileImageUrl: string | ArrayBuffer | null = null;

  // الدالة اللي بتشتغل لما اليوزر يختار صورة
  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    // التأكد إن اليوزر اختار ملف وإنه صورة
    if (file && file.type.match(/image\/*/) != null) {
      const reader = new FileReader();
      
      // لما تخلص قراية الملف، حطه في المتغير عشان يتعرض في الـ HTML
      reader.onload = (e) => {
        this.profileImageUrl = reader.result;
      };
      
      reader.readAsDataURL(file);
    }
  }
}