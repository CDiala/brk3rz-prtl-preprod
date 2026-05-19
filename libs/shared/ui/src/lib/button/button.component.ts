import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClass(): string {
    const baseClasses = 'font-semibold rounded-md transition-all duration-200';

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'w-full bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
      secondary:
        'w-full bg-slate-50 border border-slate-300 text-red-800 hover:bg-slate-200 active:bg-slate-400',
      outline:
        'w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100',
      text: 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
    };

    // In buttonClass getter
    const disabledClasses = this.disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:cursor-pointer';

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${disabledClasses}`;
  }

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
