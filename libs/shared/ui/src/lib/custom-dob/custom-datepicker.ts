import {
  Component,
  Optional,
  Self,
  inject,
  ChangeDetectorRef,
  DoCheck,
  Input,
} from '@angular/core';
import { ReactiveFormsModule, FormControl, NgControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'lib-custom-datepicker', // 💡 Renamed to reflect generic use
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './custom-datepicker.html',
  styleUrl: './custom-datepicker.css',
  providers: [],
})
export class CustomDatepicker implements DoCheck {
  internalControl = new FormControl();

  // ⚙️ Reusable Configuration Inputs
  @Input() label = 'Select Date';
  @Input() max: Date | null = null; // Replaces fixed maxDate
  @Input() min: Date | null = null; // Added support for past limits (e.g., policy start)

  // 💬 Dynamic Error Message Dictionary Input
  @Input() errorMessages: { [key: string]: string } = {};

  // 📝 Default/Fallback Error Messages
  private defaultErrors: { [key: string]: string } = {
    required: 'This date field is required.',
    matDatepickerMax: 'Date is past the maximum allowed limit.',
    matDatepickerMin: 'Date is prior to the minimum allowed limit.',
  };

  onChange: any = () => {
    //
  };
  onTouched: any = () => {
    //
  };

  public ngControl = inject(NgControl, { optional: true, self: true });
  private cdr = inject(ChangeDetectorRef);

  customErrorMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl | null) => {
      const parentControl = this.ngControl?.control;
      return !!(
        (parentControl &&
          parentControl.invalid &&
          (parentControl.touched || parentControl.dirty)) ||
        (control && control.invalid && (control.touched || control.dirty))
      );
    },
  };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.internalControl.valueChanges.subscribe((value) => {
      this.onChange(value);
    });
  }

  // 🛡️ Safe Error Resolver Getter
  get errorMessage(): string {
    const parentControl = this.ngControl?.control;
    if (!parentControl || !parentControl.errors) return '';

    // Extract the active error keys (e.g., ['required', 'underaged'])
    const activeErrors = Object.keys(parentControl.errors);
    if (activeErrors.length === 0) return '';

    // Prioritize errors: pick the first active error found
    const currentErrorKey = activeErrors[0];

    // Check custom map input first, then drop back to global defaults
    return (
      this.errorMessages[currentErrorKey] ||
      this.defaultErrors[currentErrorKey] ||
      `Invalid field value (${currentErrorKey}).`
    );
  }

  ngDoCheck(): void {
    const parentControl = this.ngControl?.control;
    if (parentControl) {
      if (parentControl.touched && !this.internalControl.touched) {
        this.internalControl.markAsTouched();
        this.cdr.markForCheck();
      }
      if (!parentControl.touched && this.internalControl.touched) {
        this.internalControl.markAsUntouched();
        this.cdr.markForCheck();
      }
    }
  }

  onBlur(): void {
    this.onTouched();
    this.ngControl?.control?.markAsTouched();
  }

  get isRequired(): boolean {
    const control = this.ngControl?.control;
    if (control && control.validator) {
      const validator = control.validator({} as any);
      return !!(validator && validator['required']);
    }
    return false;
  }

  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   isDisabled ? this.internalControl.disable() : this.internalControl.enable();
  // }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }
}

// import { Component, inject, ChangeDetectorRef } from '@angular/core';
// import { ReactiveFormsModule, FormControl, NgControl } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { ErrorStateMatcher } from '@angular/material/core';

// @Component({
//   selector: 'lib-custom-dob',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//   ],
//   templateUrl: './custom-dob.html',
//   styleUrl: './custom-dob.css',
//   providers: [],
// })
// export class CustomDob {
//   internalControl = new FormControl();
//   maxDate = new Date();

//   onChange: any = () => {
//     //
//   };
//   onTouched: any = () => {
//     //
//   };

//   public ngControl = inject(NgControl, { optional: true, self: true });
//   private cdr = inject(ChangeDetectorRef); // 👈 Inject ChangeDetectorRef to force UI updates

//   customErrorMatcher: ErrorStateMatcher = {
//     isErrorState: (control: FormControl | null) => {
//       const parentControl = this.ngControl?.control;
//       // ✅ Check parent status safely
//       return !!(
//         parentControl &&
//         parentControl.invalid &&
//         (parentControl.touched || parentControl.dirty)
//       );
//     },
//   };

//   constructor() {
//     if (this.ngControl) {
//       this.ngControl.valueAccessor = this;
//     }

//     this.internalControl.valueChanges.subscribe((value) => {
//       this.onChange(value);

//       // ✅ Use setTimeout to let Angular complete the parent validation cycle
//       // before forcing the UI validation state to re-evaluate
//       setTimeout(() => {
//         this.cdr.markForCheck();
//       });
//     });
//   }

//   // ✅ Triggered when the user leaves the input box
//   onBlur(): void {
//     this.onTouched();
//     this.ngControl?.control?.markAsTouched(); // Push touched status to parent form group
//   }

//   get isRequired(): boolean {
//     const control = this.ngControl?.control;
//     if (control && control.validator) {
//       const validator = control.validator({} as any);
//       return !!(validator && validator['required']);
//     }
//     return false;
//   }

//   writeValue(value: any): void {
//     // Avoid infinite loop by passing emitEvent: false
//     this.internalControl.setValue(value, { emitEvent: false });
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }
//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     if (isDisabled) {
//       this.internalControl.disable();
//     } else {
//       this.internalControl.enable();
//     }
//   }
// }
