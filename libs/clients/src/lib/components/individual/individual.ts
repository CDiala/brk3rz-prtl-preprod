import { Subscription } from 'rxjs';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomDatepicker } from '@insurFlow/shared';
import { EmploymentMode, LGA, State } from '@insurFlow/core';

// Custom Validator for 18 years and above
export function ageMin18Validator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) {
    return null; // Let 'required' validator handle empty values
  }

  const selectedDate = new Date(control.value);
  const today = new Date();
  console.log('date', selectedDate);

  // Calculate age accurately by accounting for months and days
  let age = today.getFullYear() - selectedDate.getFullYear();
  const monthDifference = today.getMonth() - selectedDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < selectedDate.getDate())
  ) {
    age--;
  }

  console.log('age', age);

  return age >= 18 ? null : { underaged: true };
}

@Component({
  selector: 'lib-individual',
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
    MatCardModule,
    CustomDatepicker,
  ],
  templateUrl: './individual.html',
  styleUrl: './individual.css',
})
export class Individual implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  kycForm!: FormGroup;

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
  occupations: string[] = ['Teacher', 'Trader'];
  idMeans: string[] = [
    'National ID',
    'International Passport',
    "Driver's License",
    'Others',
  ];
  filteredLgaOptions: LGA[] = [
    {
      id: 1,
      stateProvinceId: 2,
      name: 'Oshodi-Isolo',
    },
  ];
  stateOptions: State[] = [
    {
      id: 1,
      name: 'Lagos',
    },
  ];
  nationalities: any[] = ['Nigeria'];
  employmentModes = Object.values(EmploymentMode);
  employmentMode = EmploymentMode;
  private subscription = new Subscription();

  private phonePattern = /^(?:\+234|0)\d{8,10}$/;
  private bvnPattern = /^\d{11}$/;
  today = new Date();

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.kycForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required]],
        middleName: ['', []],
        lastName: ['', [Validators.required]],
        policyNumber: ['', []],
        gender: ['', [Validators.required]],
        idType: ['', [Validators.required]],
        idNumber: ['', []], // TODO: add required validator if 'others' is selected in idType
        placeOfIssue: ['', []], // TODO: add required validator if 'others' is selected in idType
        dateOfIssue: ['', []], // TODO: add required validator if 'others' is selected in idType
        issuingAuthority: ['', []], // TODO: add required validator if 'others' is selected in idType
        expiryDate: ['', []], // TODO: add required validator if 'others' is selected in idType
        dateOfBirth: ['', [Validators.required, ageMin18Validator]],
        bvn: ['', [Validators.pattern(this.bvnPattern)]],
        nin: ['', [Validators.required, Validators.pattern(this.bvnPattern)]],
        mobileNumber: ['', [Validators.required]],
        alternateMobileNumber: ['', []],
        email: ['', [Validators.required, Validators.email]],
        mothersMaidenName: ['', [Validators.required]],
      }),

      // Step 2 FormArray (Wrapped inside a parent group so the stepper can track its status)
      contactInfo: this.fb.group({
        residentialAddress: ['', [Validators.required]],
        stateOfResidence: ['', [Validators.required]],
        lgaOfResidence: ['', [Validators.required]],
        contactAddress: ['', [Validators.required]],
        contactState: ['', [Validators.required]],
        contactLga: ['', [Validators.required]],
        employmentType: ['', [Validators.required]],
        employerName: ['', []],
        employerAddress: ['', []],
        employerPhone: ['', []],
        occupation: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        stateOfOrigin: ['', [Validators.required]],
        lgaOfOrigin: ['', [Validators.required]],
        homeTown: ['', [Validators.required]],
        permanentHomeAddress: ['', [Validators.required]],
      }),

      // Step 3 FormGroup
      consent: this.fb.group({
        termsAndConditions: [false, Validators.requiredTrue],
        signatureFile: [null, Validators.required],
      }),
    });
  }

  ngAfterViewInit(): void {
    // monitor ID type and toggle control validator
    this.trackID();
    this.trackEmployment();
  }

  trackID() {
    this.subscription.add(
      this.personalInfo.get('idType')?.valueChanges.subscribe({
        next: (value: string) => {
          console.log('value:', value);

          if (value.toLowerCase().trim() === 'others') {
            this.addValidators(this.personalInfo, Validators.required, [
              'idNumber',
              'placeOfIssue',
              'dateOfIssue',
              'issuingAuthority',
              'expiryDate',
            ]);
          } else {
            this.removeValidators(this.personalInfo, Validators.required, [
              'idNumber',
              'placeOfIssue',
              'dateOfIssue',
              'issuingAuthority',
              'expiryDate',
            ]);
          }
        },
      }),
    );
  }

  trackEmployment() {
    this.subscription.add(
      this.contactInfo.get('employmentType')?.valueChanges.subscribe({
        next: (value: string) => {
          console.log('employment value:', value);

          if (value.toLowerCase().trim() === 'employee') {
            this.addValidators(this.contactInfo, Validators.required, [
              'employerName',
              'employerAddress',
              'employerPhone',
            ]);
          } else {
            this.removeValidators(this.contactInfo, Validators.required, [
              'employerName',
              'employerAddress',
              'employerPhone',
            ]);
          }
        },
      }),
    );
  }

  addValidators(form: FormGroup, validator: ValidatorFn, controls: string[]) {
    controls.forEach((control) => {
      const ctrl = form.get(control);
      if (ctrl) {
        ctrl.addValidators(validator);
        ctrl.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  removeValidators(
    form: FormGroup,
    validator: ValidatorFn,
    controls: string[],
  ) {
    controls.forEach((control) => {
      const ctrl = form.get(control);
      if (ctrl) {
        ctrl.removeValidators(validator);
        ctrl.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  get personalInfo(): FormGroup {
    return this.kycForm.get('personalInfo') as FormGroup;
  }

  get contactInfo(): FormGroup {
    return this.kycForm.get('contactInfo') as FormGroup;
  }

  get consentGroup(): FormGroup {
    return this.kycForm.get('consent') as FormGroup;
  }

  getControl(name: string): FormControl {
    return this.kycForm.get(name) as FormControl;
  }

  onFileUploadPlaceholder(event: Event, controlPath: string): void {
    // placeholder to integrate a real file upload component later
    console.log('file uploaded for', controlPath, event);
  }

  onSubmit(): void {
    if (this.kycForm.valid) {
      console.log('KY C Payload', this.kycForm.value);
      alert('Form submitted');
    } else {
      this.kycForm.markAllAsTouched();
    }
  }
}
