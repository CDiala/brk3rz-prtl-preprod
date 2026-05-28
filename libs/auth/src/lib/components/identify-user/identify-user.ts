/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Snackbar } from '@insurFlow/services';
import * as AuthActions from '../../../../../auth-data/src/lib/+state/auth.actions';
import { combineLatest, Subscription } from 'rxjs';
import { ButtonComponent } from '@insurFlow/shared';
import { MatCard } from '@angular/material/card';
import { AuthFacade } from '../../../../../auth-data/src/lib/+state/auth.facade';

@Component({
  selector: 'lib-identify-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ButtonComponent,
    RouterLink,
    MatCard,
  ],
  templateUrl: './identify-user.html',
  styleUrls: ['./identify-user.css'],
})
export class IdentifyUser implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private snackbarService = inject(Snackbar);
  private router = inject(Router);
  private aRoute = inject(ActivatedRoute);
  private store = inject(Store);
  private facade = inject(AuthFacade);
  private subscription = new Subscription();
  protected routeInfo: { path: string; user: string } = { path: '', user: '' };
  protected loading = signal(false);

  protected form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.getRouteiInfo();

    this.trackEmailDelivery();
  }

  getRouteiInfo() {
    this.subscription.add(
      combineLatest([this.aRoute.url, this.aRoute.queryParams]).subscribe(
        ([url, params]) => {
          this.routeInfo.path = url[0].path.replace(/-/g, ' ');
          this.routeInfo.user = params['v'] || 'testing chibuzo';
        },
      ),
    );
  }

  trackEmailDelivery() {
    this.subscription.add(
      this.facade.passwordResetLinkInfo$.subscribe({
        next: (res) => {
          if (res?.isEmailSent) {
            this.router.navigate(['/auth/reset-link-success']);
          }
        },
      }),
    );
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    try {
      this.store.dispatch(
        AuthActions.sendResetLink({
          email: this.form.value.username as string,
        }),
      );
    } catch (e: any) {
      this.snackbarService.displaySnackBar(
        e?.message || 'Login failed',
        '',
        'red-snackbar',
      );
      // this.isLoggedIn.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
