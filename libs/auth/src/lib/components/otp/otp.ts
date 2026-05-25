import {
  Component,
  forwardRef,
  signal,
  ViewChildren,
  QueryList,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-otp',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './otp.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Otp),
      multi: true,
    },
  ],
})
export class Otp implements ControlValueAccessor, AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<any>;
  @Output() otpComplete = new EventEmitter<string>();
  @Output() navigateBack = new EventEmitter();
  @Output() requestOTP = new EventEmitter<boolean>(false);
  @Input() email = 'unknown@email.com';

  otpValues = signal<string[]>(['', '', '', '', '', '']);
  isInvalid = signal(false);
  private onChange: (value: string) => void = () => {
    /* empty */
  };
  private onTouched: () => void = () => {
    /* empty */
  };

  ngAfterViewInit() {
    // Focus on the first input
    if (this.otpInputs.length > 0) {
      setTimeout(() => this.otpInputs.first.nativeElement.focus());
    }
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Only allow numeric input
    if (!/^\d*$/.test(value)) {
      this.isInvalid.set(true);
      input.value = '';
      const currentValues = [...this.otpValues()];
      currentValues[index] = '';
      this.otpValues.set(currentValues);
      return;
    }

    // Reset invalid state if input is now valid
    if (this.isInvalid() && /^\d$/.test(value)) {
      this.isInvalid.set(false);
    }

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const currentValues = [...this.otpValues()];
    currentValues[index] = value;
    this.otpValues.set(currentValues);

    // Move to next input if digit entered
    if (value && index < 5) {
      setTimeout(() => {
        this.otpInputs.toArray()[index + 1].nativeElement.focus();
      });
    }

    this.updateValue();

    // // unnecessary emission
    // // Emit when all 6 digits are filled
    // if (currentValues.every((v) => v !== '')) {
    //   this.otpComplete.emit(currentValues.join(''));
    // }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (input.value) {
        event.preventDefault();
        const currentValues = [...this.otpValues()];
        currentValues[index] = '';
        this.otpValues.set(currentValues);
        this.updateValue();
        input.value = '';
      } else if (index > 0) {
        event.preventDefault();
        this.otpInputs.toArray()[index - 1].nativeElement.focus();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (!/^\d+$/.test(digits)) {
      this.isInvalid.set(true);
      return;
    }

    const newValues = digits
      .split('')
      .concat(Array(6 - digits.length).fill(''));
    this.otpValues.set(newValues);
    this.updateValue();

    // Focus on the last filled input or the next empty one
    const focusIndex = Math.min(digits.length, 5);
    setTimeout(() => {
      this.otpInputs.toArray()[focusIndex].nativeElement.focus();
    });

    // // unnecessary emission
    // if (digits.length === 6) {
    //   this.otpComplete.emit(digits);
    // }
  }

  goBack() {
    this.navigateBack.emit();
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (value) {
      const digits = value.split('');
      this.otpValues.set(digits.concat(Array(6 - digits.length).fill('')));
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Can be implemented if needed
  }

  private updateValue(): void {
    const fullOtp = this.otpValues().join('');
    this.onChange(fullOtp);
  }

  isOtpIncomplete() {
    return this.otpValues().some((v: string) => v === '');
  }

  reset(): void {
    this.otpValues.set(['', '', '', '', '', '']);
    this.isInvalid.set(false);
    this.updateValue();
    if (this.otpInputs.length > 0) {
      this.otpInputs.first.nativeElement.focus();
    }
  }

  markAsInvalid(): void {
    this.isInvalid.set(true);
  }

  resendOTP(): void {
    this.requestOTP.emit(true);
  }

  onVerify(): void {
    const fullOtp = this.otpValues().join('');
    if (fullOtp.length === 6) {
      this.otpComplete.emit(fullOtp);
    }
  }
}
