import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardVariant = 'light' | 'dark' | 'accent';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() variant: CardVariant = 'light';
  @Input() padded = true;

  get cardClass(): string {
    const baseClasses =
      'rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md';

    const variantClasses: Record<string, string> = {
      light: 'bg-white border-gray-200',
      dark: 'bg-gray-900 border-gray-800 text-white',
      accent: 'bg-red-600 border-red-700 text-white',
    };

    const paddingClass = this.padded ? 'p-6' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${paddingClass}`;
  }
}
