import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // Đổi từ FormsModule
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-register', // Sửa từ 'app-login'
  imports: [ReactiveFormsModule, CommonModule], // Đổi từ FormsModule
  templateUrl: './register.component.html',
  styleUrls: [],
})
export class RegisterComponent implements OnInit {
  form: FormGroup
  formError = signal<string>('')

  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required], // Thêm lại
      agreeTerms: [false, Validators.requiredTrue], // Thêm lại
    }, { validators: this.passwordMatchValidator })
  }

  // Improved password match validator
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value
    const confirmPassword = control.get('confirmPassword')?.value
    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  // Getter methods for easy validation access
  get username() { return this.form.get('username') }
  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }
  get confirmPassword() { return this.form.get('confirmPassword') }
  get agreeTerms() { return this.form.get('agreeTerms') }

  // Check if form has password mismatch error
  get hasPasswordMismatch() {
    return this.form.hasError('passwordMismatch') &&
           this.confirmPassword?.touched &&
           this.password?.touched
  }

  ngOnInit(): void {
    console.log('init register form');
  }

  // Bỏ onChange method vì không cần thiết với reactive forms

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    // Chỉ lấy các fields cần thiết cho API
    const formData = {
      username: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      role: this.form.get('role')?.value
    }

    console.log('Form Data:', formData)

    this.authService.register(formData).subscribe((res) => {
      if (res.success && res.statusCode === 201) {
        this.router.navigate(['/login'])
      }else{
        this.formError.set(res.message)
      }
    })
  }
}
