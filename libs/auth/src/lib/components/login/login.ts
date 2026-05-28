/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '@insurFlow/shared';
import { AuthRequest, EMAIL_REGEX } from '@insurFlow/core';
import { PasswordHintComponent } from '../password-hint/password-hint';
import {
  distinctUntilChanged,
  filter,
  map,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import {
  AuthFacade,
  loginUser,
  selectAuthError,
  selectSpecialAuthError,
} from '@insurFlow/auth-data';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from '../../../../../shared/ui/src/lib/dialog/dialog.component';
import * as AuthActions from '../../../../../auth-data/src/lib/+state/auth.actions';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

export interface BackendError {
  code: string;
  message: string;
  data?: any;
}
@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    ButtonComponent,
    DialogComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements AfterViewInit, OnInit, OnDestroy {
  protected loginForm!: FormGroup;
  protected hidePassword = signal(true);
  protected isLoading = signal(false);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private authFacade = inject(AuthFacade);
  private subscription = new Subscription();
  @ViewChild('errorTemplate') errorTemplate!: TemplateRef<string>;
  protected loginError = '';

  private destroy$ = new Subject<void>();
  currentErrorCode: string | number | null = null;
  errorDataPayload: any = null;

  constructor() {
    this.createForm();
  }

  // ngOnInit(): void {
  //   // Clear stale errors on component load
  //   this.store.dispatch(AuthActions.clearAuthError());

  //   this.store
  //     .select(selectAuthError)
  //     .pipe(
  //       filter((error): error is BackendError => !!{error:}),
  //       distinctUntilChanged(),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe((error) => {
  //       const licenceErrors = [
  //         'Invalid email or password.',
  //         'Invalid request',
  //       ];

  //       const isLicenceError = licenceErrors.includes(error);

  //       this.loginError = isLicenceError
  //         ? 'Your licence has expired. Proceed to upload a new licence to regain access.'
  //         : error;

  //       if (isLicenceError) {
  //         this.openDialog(this.errorTemplate);
  //       } else {
  //         this.openSpecialDialog(this.errorTemplate);
  //       }

  //       // Delay clearing slightly to avoid immediate re-emission issues
  //       setTimeout(() => {
  //         this.store.dispatch(AuthActions.clearAuthError());
  //       });
  //     });
  // }

  ngOnInit(): void {
    this.store
      .select(selectSpecialAuthError)
      .pipe(
        // Ensure the error object is real and contains message metadata
        filter((error): error is BackendError => !!error && 'message' in error),
        distinctUntilChanged(
          (prev, curr) =>
            prev.code === curr.code && prev.message === curr.message,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((errorData: BackendError) => {
        const errorMessage = errorData.message;
        this.currentErrorCode = errorData.code;
        this.errorDataPayload = errorData.data;

        this.store.dispatch(
          AuthActions.getUserIdError({
            userId: errorData.data?.userId || null,
          }),
        );

        const isLicenceError = this.currentErrorCode === '04';

        this.loginError = isLicenceError
          ? 'Your licence has expired. Proceed to upload a new licence to regain access.'
          : errorMessage;

        // 1. Close active modal queues to handle reset cleanups
        this.dialog.closeAll();

        // 2. Launch the correct localized dialog template modal interface view
        if (isLicenceError) {
          this.openDialog(this.errorTemplate);
        } else {
          this.openSpecialDialog(this.errorTemplate);
        }

        // === CRITICAL FIX ===
        // Clear the error from state immediately so the subscription doesn't re-execute
        // when change-detection fires from the newly opened modal.
        this.store.dispatch(AuthActions.clearAuthError());
      });
  }

  ngAfterViewInit(): void {
    this.checkLogin();
    //   this.store.select(selectAuthError).subscribe((error) => {
    //    if(error === 'Invalid email or password.' || error ==='Invalid request') {
    //     this.loginError = 'Your licence has expired. Proceed to upload a new licence to regain access.';
    //     this.openDialog(this.errorTemplate);
    //    } else if (error) {
    //     this.loginError = error;

    //     this.openSpecialDialog(this.errorTemplate);
    //   }
    // });
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(EMAIL_REGEX),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  checkLogin() {
    this.subscription.add(
      this.authFacade.loggedInUser$.subscribe({
        next: (res) => {
          console.log('res', res);

          if (res || res === null) {
            this.isLoading.set(false);
          }

          console.log('this.isLoading', this.isLoading, typeof res);
        },
      }),
    );
  }

  // checkLogin() {
  //   this.subscription.add(
  //     this.authFacade.loggedInUser$
  //       .pipe(
  //         filter((res) => !!res), // 2. Blocks null/undefined values from reaching your subscribe block
  //       )
  //       .subscribe({
  //         next: (res) => {
  //           this.isLoading.set(false);
  //           // Open your dialog panel here safely
  //         },
  //       }),
  //   );
  // }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      const credentials: AuthRequest = {
        email: this.loginForm.value.email.trim(),
        password: this.loginForm.value.password.trim(),
      };

      this.store.dispatch(loginUser({ credentials }));
    }
  }

  viewPasswordHint(event: Event): void {
    event.stopPropagation();
    this.dialog.open(PasswordHintComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSpecialDialog(template: TemplateRef<any>) {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '400px',
      data: {
        title: '',
        content: template,
        cancelButton: 'Close',
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // openDialog(template: TemplateRef<any>) {
  //   this.dialog.open(DialogComponent, {
  //     width: '600px',
  //     height: '400px',
  //     data: {
  //       title: '',
  //       content: template,
  //       cancelButton: 'Proceed',
  //       loginError: this.loginError
  //     },
  //   });
  // }

  openDialog(template: TemplateRef<any>) {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '400px',
      data: {
        title: '',
        content: template,
        buttonText: 'Proceed',
        buttonAction: this.renewLicenceRoute.bind(this), // Bind the method to ensure correct 'this' context,
      },
    });
  }

  renewLicenceRoute() {
    this.router.navigate(['auth/licence-renewal']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}
