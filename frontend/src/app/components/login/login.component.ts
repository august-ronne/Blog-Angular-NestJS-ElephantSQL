import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  login() {
    this.authenticationService
      .login('rudolf@test.com', 'testing')
      .subscribe((data) => {
        console.log('success', data);
      });
  }

  ngOnInit(): void {}
}
