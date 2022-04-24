import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  navigateTo(value: any): void {
    this.router.navigate(['../', value]);
  }

  logout(): void {
    this.authService.logout();
  }
}
