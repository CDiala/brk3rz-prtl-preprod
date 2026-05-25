import { TitleCasePipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ChangeDetectorRef,
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
import { combineLatest, firstValueFrom, Subscription } from 'rxjs';
import {
  updatePassword,
  AuthFacade,
  CryptoService,
  register,
} from '@insurFlow/auth-data';
import { RegisterRequest, UpdatePasswordRequest, User } from '@insurFlow/core';
import { Snackbar } from '@insurFlow/services';
import { ButtonComponent } from '@insurFlow/shared';

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
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private facade = inject(AuthFacade);
  private snackbar = inject(Snackbar);
  private cdr = inject(ChangeDetectorRef);
  private encryptionService = inject(CryptoService);
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

    this.testEncryption();
  }

  testEncryption() {
    firstValueFrom(
      this.encryptionService.encryptRequest(
        'dialachibuzo@yahoo.com',
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5gLTqapdoCUZBAud2GSE\nJW0tXUf6FJDHMQS5D0+y3sov8wN+DxEpBUGFPKcbSm1KPt3FEXFqTAPLtcECedyw\nE+EojzXxG8/EZmfMLM51O9pfgWWsbg1l7ASyPm/DrVznCFubZp1WbzOgBOi0ZG/K\nTKRt34vgtQ/rnShwUeYsl49Wd5kFoQv8suaTyzOOBNKmxtgwxIFobVXZbQKHOKaZ\nQNjsdmTTFlx5lBFwR1DIrVzy2PdByIy2/GXvdRo2nynslgAcTdtuAXgX19jxEOHK\nP0XLzM7YRwESLm3905VifpE+fv+Jkw31Q/16RMu2T45k9IC7tTPoCE3GLu9XugaP\nAQIDAQAB\n-----END PUBLIC KEY-----',
      ),
    ).then((res) => console.log('encrypted email', res));
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
        console.log('url + param', url, params);

        this.routeInfo.path = url[0].path.replace(/-/g, ' ');

        const userEmail = params['v'] || '';

        console.log('userEmail', userEmail);

        if (userEmail) {
          this.resetForm.get('email')?.setValue(userEmail);
          this.resetForm.get('email')?.disable();
          this.resetForm.get('email')?.updateValueAndValidity();
          this.cdr.detectChanges();
        } else {
          this.resetForm.get('email')?.enable();
          this.resetForm.get('email')?.updateValueAndValidity();
          this.cdr.detectChanges();
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
      this.resetForm.get('email')?.addValidators(Validators.email);
    } else {
      this.resetForm.get('email')?.removeValidators(Validators.email);
    }

    this.resetForm.get('email')?.updateValueAndValidity();
  }

  createForm() {
    this.resetForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
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
          email: this.user.email,
        });

        this.resetForm.get('email')?.disable();
        this.resetForm.get('email')?.updateValueAndValidity();
        this.cdr.detectChanges();

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
    // console.log('activatedRoute', this.activatedRoute.snapshot.url);
    console.log('router', this.router.url.includes('register'));

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

      // console.log('payload', payload);

      const isRegister = this.router.url.includes('register');

      if (isRegister) {
        const registerPayload: RegisterRequest = {
          email: formValue['email'],
          defaultPassword: formValue['token'],
          newPassword: formValue['newPassword'],
          confirmNewPassword: formValue['confirmNewPassword'],
        };

        this.store.dispatch(
          register({
            data: registerPayload,
          }),
        );
      } else {
        const resetPasswordPayload: UpdatePasswordRequest = {
          email: formValue['email'],
          otp: formValue['token'],
          newPassword: formValue['newPassword'],
          confirmNewPassword: formValue['confirmNewPassword'],
        };

        this.store.dispatch(
          updatePassword({
            data: resetPasswordPayload,
          }),
        );
      }

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
