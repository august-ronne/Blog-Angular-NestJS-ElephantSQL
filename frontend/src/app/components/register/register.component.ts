import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, pipe } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

class CustomValidators {
  static passwordContainsNumber(
    control: AbstractControl
  ): ValidationErrors | null {
    const regex = /\d/;
    if (regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return { passwordLacksNumber: true };
    }
  }

  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    if (password === passwordConfirm) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  // Convenience getter for FormGroup controls
  get form(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.registerForm.value);
    this.authenticationService
      .register(this.registerForm.value)
      .pipe(
        map((user) => {
          console.log(user);
          this.router.navigate(['login']);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        username: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        email: [
          null,
          [
            Validators.required,
            Validators.email,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
            CustomValidators.passwordContainsNumber,
          ],
        ],
        passwordConfirm: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
      },
      {
        validators: CustomValidators.passwordsMatch,
      }
    );
  }
}
