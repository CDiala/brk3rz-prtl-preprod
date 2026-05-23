import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormGroupDirective,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import {
  // Encryption,
  Snackbar,
} from '@insurFlow/services';
import { UpdatePasswordRequest, User } from '@insurFlow/core';
import { ButtonComponent } from '@insurFlow/shared';
import { updatePassword } from '../../+state/auth.actions';
import { TitleCasePipe } from '@angular/common';
import { AuthFacade } from '../../+state/auth.facade';

@Component({
  selector: 'lib-signup',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    ButtonComponent,
    TitleCasePipe,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;
  private fb = inject(FormBuilder);
  // private encryptionService = inject(Encryption);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private facade = inject(AuthFacade);
  private snackbar = inject(Snackbar);
  private subscription = new Subscription();
  protected resetForm!: FormGroup;
  protected hide = signal(true);
  protected cHide = signal(true);
  protected isPasswordReset = signal(false);
  protected isUpdated = signal(false);
  protected hasUserData: boolean | undefined;
  protected user!: User;
  protected routeInfo: { path: string; user: string } = { path: '', user: '' };

  constructor() {
    this.createForm();

    this.checkPasswordsMatch();

    this.getUserData();
  }

  ngOnInit(): void {
    this.getRouteInfo();

    // listen to password update status
    this.checkPasswordUpdate();

    // update control validators
    this.updateValidator();
  }

  getRouteInfo() {
    this.subscription.add(
      combineLatest([
        this.activatedRoute.url,
        this.activatedRoute.queryParams,
      ]).subscribe(([url, params]) => {
        this.routeInfo.path = url[0].path.replace(/-/g, ' ');

        const userEmail = params['v'] || '';

        if (userEmail) {
          this.resetForm.get('email')?.setValue(userEmail);
          this.resetForm.get('email')?.disable();
        } else {
          this.resetForm.get('email')?.enable();
        }

        this.routeInfo.user = params['v'] || '';
      }),
    );
  }

  checkPasswordUpdate() {
    this.subscription.add(
      this.facade.updatedPassword$.subscribe({
        next: (status) => {
          if (status) {
            this.form.resetForm();
            this.isPasswordReset.set(true);
          } else if (status === false) {
            this.isPasswordReset.set(false);
          }
        },
      }),
    );
  }

  updateValidator() {
    if (this.routeInfo.path.toLowerCase().includes('reset')) {
      this.resetForm.get('username')?.addValidators(Validators.email);
    } else {
      this.resetForm.get('username')?.removeValidators(Validators.email);
    }

    this.resetForm.get('username')?.updateValueAndValidity();
  }

  createForm() {
    this.resetForm = this.fb.nonNullable.group({
      username: ['', [Validators.required]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.confirmPasswordValidator,
        ],
      ],
    });
  }

  // control-level validator: compares this control's value with newPassword on the parent
  confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
    const parent = control.parent as FormGroup | null;
    if (!parent) return null;
    const password = parent.get('newPassword')?.value;
    const confirm = control.value;
    return password && confirm && password !== confirm
      ? { passwordMismatch: true }
      : null;
  };

  checkPasswordsMatch() {
    // ensure confirm control re-validates when newPassword changes
    const newPassControl = this.resetForm.get('newPassword');
    const confirmControl = this.resetForm.get('confirmNewPassword');
    if (newPassControl && confirmControl) {
      this.subscription.add(
        newPassControl.valueChanges.subscribe(() => {
          confirmControl.updateValueAndValidity({
            onlySelf: true,
            emitEvent: false,
          });
        }),
      );
    }
  }

  async getUserData() {
    const params = this.getParam();
    console.log('params', params);

    if (params) {
      const decryptedData = await this.decryptUserData(params);

      console.log('decrpyt', decryptedData);

      if (decryptedData) {
        this.user = decryptedData;
        this.resetForm.patchValue({
          username: this.user.email,
        });

        this.resetForm.get('username')?.disable();

        this.hasUserData = true;
      }
    } else {
      this.hasUserData = false;
    }
  }

  getParam() {
    const params = this.activatedRoute.snapshot.queryParams;

    if (Object.keys(params).length && 'u' in params) {
      return params['u'];
    }

    if (Object.keys(params).length && 'v' in params) {
      return params['v'];
    }

    return null;
  }

  async decryptUserData(encryptedData: string) {
    // return this.encryptionService.decrypt(encryptedData);
    return {} as any; // TODO: REPLACE WITH ACTUAL IMPLEMENTATION
  }

  async onSubmit() {
    const { token, newPassword } = this.resetForm.getRawValue();

    if (
      (<string>token)
        .toLowerCase()
        .localeCompare((<string>newPassword).toLowerCase()) === 0
    ) {
      // alert('new password must be different from existing password');
      this.snackbar.displaySnackBar(
        '⚠️ New password must be different from existing password',
        '',
        'orange-snackbar',
      );
      return;
    }

    if (this.resetForm.valid) {
      const formValue = this.resetForm.getRawValue();
      const payload: UpdatePasswordRequest = {
        username: formValue['username'],
        otp: formValue['token'],
        password: formValue['newPassword'],
      };

      console.log('payload', payload);

      this.store.dispatch(
        updatePassword({
          data: payload,
          isRegister: this.routeInfo.path.toLowerCase().includes('register'),
        }),
      );

      return;
    }

    this.resetForm.markAllAsTouched();
    this.resetForm.markAsDirty();
    this.resetForm.updateValueAndValidity();
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
