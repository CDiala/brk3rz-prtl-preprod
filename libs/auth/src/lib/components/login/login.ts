import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
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
import { Subscription } from 'rxjs';
import { AuthFacade, loginUser } from '@insurFlow/auth-data';

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
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements AfterViewInit, OnDestroy {
  protected loginForm!: FormGroup;
  protected hidePassword = signal(true);
  protected isLoading = signal(false);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private authFacade = inject(AuthFacade);
  private subscription = new Subscription();

  constructor() {
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.checkLogin();
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

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      const credentials: AuthRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
