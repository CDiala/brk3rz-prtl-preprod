import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomDatepicker } from '@insurFlow/shared';

@Component({
  selector: 'lib-corporate',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    CustomDatepicker,
  ],
  templateUrl: './corporate.html',
  styleUrl: './corporate.css',
})
export class Corporate implements OnInit {
  private fb = inject(FormBuilder);
  onboardingForm!: FormGroup;

  nigerianStates: string[] = [
    'Lagos',
    'Abia',
    'FCT - Abuja',
    'Kano',
    'Rivers',
    'Anambra',
    'Ogun',
    'Oyo',
  ];
  titles: string[] = ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'];
  genders: string[] = ['Male', 'Female'];
  idMeans: string[] = [
    'National ID',
    'International Passport',
    "Driver's License",
  ];

  businessTypes = ['trader', 'manufacturer', 'service provider', 'other'];
  countries = ['nigeria'];
  today = new Date();

  private phonePattern = /^(?:\+234|0)\d{10}$/;
  private bvnPattern = /^\d{11}$/;

  ngOnInit(): void {
    this.initForm();
    this.addDirector();
  }

  private initForm(): void {
    this.onboardingForm = this.fb.group({
      // Step 1 FormGroup
      corporateInfo: this.fb.group({
        companyName: ['', [Validators.required]],
        operatingAddress: ['', [Validators.required]],
        operatingState: ['', [Validators.required]],
        operatingCity: ['', [Validators.required]],
        incorporationNumber: ['', [Validators.required]],
        businessType: ['', [Validators.required]],
        businessPhone: [
          '',
          [Validators.required, Validators.pattern(this.phonePattern)],
        ],
        registeredAddress: ['', [Validators.required]],
        registeredCountry: ['', [Validators.required]],
        registeredCity: ['', [Validators.required]],
        registeredState: ['', [Validators.required]],
      }),

      // Step 2 FormArray (Wrapped inside a parent group so the stepper can track its status)
      directorsGroup: this.fb.group({
        directors: this.fb.array([]),
      }),

      // Step 3 FormGroup
      consent: this.fb.group({
        termsAndConditions: [false, [Validators.requiredTrue]],
        signatureFile: [null, [Validators.required]],
      }),
    });
  }

  // Helper getters to clean up template paths
  get corporateInfoGroup(): FormGroup {
    return this.onboardingForm.get('corporateInfo') as FormGroup;
  }

  get directorsGroup(): FormGroup {
    return this.onboardingForm.get('directorsGroup') as FormGroup;
  }

  get directors(): FormArray {
    return this.onboardingForm.get('directorsGroup.directors') as FormArray;
  }

  get consentGroup(): FormGroup {
    return this.onboardingForm.get('consent') as FormGroup;
  }

  addDirector(): void {
    const directorForm = this.fb.group({
      title: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      middleName: [''],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      bvn: ['', [Validators.required, Validators.pattern(this.bvnPattern)]],
      contactAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      telephoneNumber: [
        '',
        [Validators.required, Validators.pattern(this.phonePattern)],
      ],
      email: ['', [Validators.required, Validators.email]],
      idMeans: ['', [Validators.required]],
      idFile: [null, [Validators.required]],
      idNumber: ['', [Validators.required]],
      stateOfOrigin: ['', [Validators.required]],
      otherStateOfOrigin: [''],
      occupation: ['', [Validators.required]],
      employerName: ['', [Validators.required]],
      employerPhone: [
        '',
        [Validators.required, Validators.pattern(this.phonePattern)],
      ],
      employerAddress: ['', [Validators.required]],
      employerCity: ['', [Validators.required]],
      employerState: ['', [Validators.required]],
      employerCountry: ['', [Validators.required]],
    });

    directorForm.get('stateOfOrigin')?.valueChanges.subscribe((value) => {
      const otherStateCtrl = directorForm.get('otherStateOfOrigin');
      if (value === 'Non-Nigerian') {
        otherStateCtrl?.setValidators([Validators.required]);
      } else {
        otherStateCtrl?.clearValidators();
        otherStateCtrl?.setValue('');
      }
      otherStateCtrl?.updateValueAndValidity();
    });

    this.directors.push(directorForm);
    console.log('this.directors:', this.directors);
  }

  removeDirector(index: number): void {
    console.log('Removing director at index:', index);
    console.log('this.directors:', this.directors.value);

    if (this.directors.length > 1) {
      this.directors.removeAt(index);
    }
  }

  onFileUploadPlaceholder(event: Event, controlPath: string): void {
    console.log(`File uploaded to: ${controlPath}`, event);

    // save file to form control
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.onboardingForm.get(controlPath)?.setValue(file);
    }
  }

  onSubmit(): void {
    if (this.onboardingForm.valid) {
      console.log('Final Registration Payload:', this.onboardingForm.value);
      alert('Form submitted successfully!');
    } else {
      this.onboardingForm.markAllAsTouched();
    }
  }
}
