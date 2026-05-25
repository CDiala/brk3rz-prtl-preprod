import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@insurFlow/shared';

@Component({
  selector: 'lib-password-hint',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, ButtonComponent],
  template: `
    <div class="p-4 md:p-6">
      <div class="flex justify-center items-center gap-3 mb-4">
        <mat-icon class="text-red-600 text-lg">lock_info</mat-icon>
        <h2 class="text-sm md:text-base font-semibold text-gray-900">
          Password Requirements
        </h2>
      </div>

      <div class="space-y-3 mb-6">
        <div class="flex items-start gap-2">
          <mat-icon class="text-green-600 text-sm! md:text-base! mt-1"
            >check_small</mat-icon
          >
          <p class="text-xs md:text-sm text-gray-700">
            <strong>Minimum 6 characters</strong> - Your password must be at
            least 6 characters long
          </p>
        </div>
        <div class="flex items-start gap-2">
          <mat-icon class="text-green-600 text-sm! md:text-base! mt-1"
            >check_small</mat-icon
          >
          <p class="text-xs md:text-sm text-gray-700">
            <strong>Mix of letters and numbers</strong> - Include at least one
            letter and one number
          </p>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
        <p class="text-xs text-blue-900">
          <strong>💡 Tip:</strong> Use a combination of uppercase, lowercase,
          and numbers for a stronger password.
        </p>
      </div>

      <lib-button
        variant="primary"
        size="md"
        type="button"
        class="w-full text-center my-4 md:my-0"
        (clicked)="dialogRef.close()"
      >
        Got it
      </lib-button>
    </div>
  `,
  styles: [],
})
export class PasswordHintComponent {
  dialogRef = inject(MatDialogRef<PasswordHintComponent>);
}
