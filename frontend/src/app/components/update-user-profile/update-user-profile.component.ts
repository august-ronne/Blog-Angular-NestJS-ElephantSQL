import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import {
  AuthenticationService,
  User,
} from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss'],
})
export class UpdateUserProfileComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
    });
    this.authService
      .getUserID()
      .pipe(
        switchMap((id: number) =>
          this.userService.findOne(id).pipe(
            tap((user: User) => {
              this.form.patchValue({
                id: user.id,
                name: user.name,
                username: user.username,
              });
            })
          )
        )
      )
      .subscribe();
  }

  updateUserProfile(): void {
    this.userService.updateOne(this.form.getRawValue()).subscribe();
  }
}
