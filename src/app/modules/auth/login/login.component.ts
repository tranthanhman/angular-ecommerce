import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isUsernameValid: boolean = true;
  error: any = '';

  returnUrl: string = '';

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    this.authService.errorSubject.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
  }

  validateUsername(): void {
    const regex = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (regex.test(this.username)) {
      this.isUsernameValid = true;
    } else {
      this.isUsernameValid = false;
    }
  }

  onKey(event: any, type: string) {
    if (type === 'username') {
      this.username = event.target.value;
      this.validateUsername();
    } else {
      this.password = event.target.value;
    }
  }

  onSubmit() {
    if (this.isUsernameValid) {

      this.authService.login(this.username, this.password).subscribe({
        next: (res) => {
          if(res.statusCode===200 && res.success){
            this.authService.setUser(res.data.accessToken, res.data.user);
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.error = 'Login failed';
        }
      });
    }
  }
}
