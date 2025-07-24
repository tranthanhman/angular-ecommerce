import { Component, input, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  isLoggedIn = input.required<boolean>();
  user = input.required<User | null>();
  dropdownProfile = signal(false);

  authService = inject(AuthService);

  constructor(){}

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.dropdownProfile.set(!this.dropdownProfile());
  }

  logout(){
    this.authService.logout()
  }
}
