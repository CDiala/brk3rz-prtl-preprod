import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'default' | 'danger' | 'success' | 'warning';

@Component({
  selector: 'lib-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';

  get badgeClass(): string {
    const baseClasses =
      'inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';

    const variantClasses: Record<BadgeVariant, string> = {
      default: 'bg-gray-100 text-gray-800',
      danger: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;
  }
}
