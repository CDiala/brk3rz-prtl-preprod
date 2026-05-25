import { Component, signal, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '@insurFlow/shared';
import { Snackbar } from '@insurFlow/services';
import { AuthFacade } from '../../../../../auth-data/src/lib/+state/auth.facade';

@Component({
  selector: 'lib-password-reset-sent',
  standalone: true,
  imports: [MatIconModule, RouterLink, ButtonComponent],
  templateUrl: './password-reset-sent.html',
  styleUrl: './password-reset-sent.css',
})
export class PasswordResetSent implements OnInit {
  email = signal('');
  authFacade = inject(AuthFacade);
  router = inject(Router);
  private snackbar = inject(Snackbar);
  resendDisabled = signal(false);
  resendCounter = signal(60);

  async ngOnInit(): Promise<void> {
    console.log('TODO: get this email from the query params');

    // TODO: get this email from the query params
    const resetInfo = await firstValueFrom(
      this.authFacade.passwordResetLinkInfo$,
    );

    if (resetInfo && resetInfo.email) {
      this.email.set(resetInfo.email);
    } else {
      console.warn('No email found in state, redirecting to forgot-password');
      this.snackbar.displaySnackBar('Redirecting...', '', 'red-snackbar');
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  handleResend() {
    this.resendDisabled.set(true);
    this.resendCounter.set(60);
    const interval = setInterval(() => {
      this.resendCounter.update((c) => c - 1);

      if (this.resendCounter() <= 0) {
        this.resendDisabled.set(false);
        this.resendCounter.set(60); // Reset for next time
        clearInterval(interval); // Stop the timer
      }
    }, 1000); // 1000ms = 1 second
  }
}
