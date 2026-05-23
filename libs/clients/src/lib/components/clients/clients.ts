import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BvnNinGuideDialog } from '../bvn-nin-guide-dialog/bvn-nin-guide-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Corporate } from '../corporate/corporate';
import { Individual } from '../individual/individual';

@Component({
  selector: 'lib-clients',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    Corporate,
    Individual,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  private myStore = inject(Store);
  clientCode = new FormControl('', [Validators.required]);
  otp = new FormControl('', [Validators.required]);
  kycForm!: FormGroup;
  cdRef = inject(ChangeDetectorRef);
  isKycUpdated = false;
  clientError = '';
  Validators = Validators;
  // protected fileOptions = EMIT_OPTION_ENUMS;
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  loading = false;
  clientType = 'I'; // TODO: get this value from dropdown

  ngOnInit(): void {
    this.buildKycForm();

    // this.manageForm();

    this.validateAdditionalDocs();

    // get token

    // this.kycForm.get('cac')?.valueChanges.subscribe((res) => console.log('file', res));
  }

  buildKycForm() {
    this.kycForm = this.fb.group(
      {
        // customerName: ['', [Validators.required]],
        // email: ['', [Validators.required, Validators.email]],
        // phoneNo1: ['', [Validators.required, Validators.pattern(/^0\d{10}$/)]],
        // phoneNo2: ['', [Validators.pattern(/^0\d{10}$/)]],
        // bvn: [
        //   '',
        //   { validators: [Validators.required, Validators.pattern(/^\d{11}$/)], updateOn: 'blur' },
        // ],
        clientType: ['', [Validators.required]],
        // nin: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        // cac: [null, []],
        // docType: ['', []],
        // form2: [null, []],
        // form7: [null, []],
        // statusreport: [null, []],
        // consent: [false, [Validators.requiredTrue]],
      },
      // { validators: [bvnNotSameAsNinValidator()] }
    );
  }

  manageForm() {
    // if (this.clientType) {
    //   // console.log(' found', this.clientType);
    //   if (this.clientType.trim().toUpperCase() === 'I') {
    //     // remove bvn if code breaks @ runtime
    //     ['bvn', 'nin'].forEach((control) => {
    //       const formControl = this.kycForm.get(control);
    //       formControl?.setValidators([
    //         Validators.required,
    //         Validators.pattern(/^\d{11}$/),
    //       ]);
    //       formControl?.updateValueAndValidity();
    //     });
    //     ['cac', 'docType'].forEach((control) => {
    //       const formControl = this.kycForm.get(control);
    //       formControl?.clearValidators();
    //       formControl?.updateValueAndValidity();
    //     });
    //   } else if (this.clientType.trim().toUpperCase() === 'C') {
    //     // remove bvn if code breaks @ runtime
    //     ['bvn', 'nin'].forEach((control) => {
    //       const formControl = this.kycForm.get(control);
    //       formControl?.clearValidators();
    //       formControl?.updateValueAndValidity();
    //     });
    //     ['cac', 'docType'].forEach((control) => {
    //       const formControl = this.kycForm.get(control);
    //       formControl?.setValidators([Validators.required]);
    //       formControl?.updateValueAndValidity();
    //     });
    //   }
    // } else {
    //   alert('not found');
    // }
  }

  validateAdditionalDocs() {
    this.kycForm.get('docType')?.valueChanges.subscribe((docType) => {
      if (docType === 'cac') {
        ['form2', 'form7'].forEach((control) => {
          this.kycForm.get(control)?.reset();
          this.kycForm.get(control)?.setValidators([Validators.required]);
        });

        this.kycForm.get('statusreport')?.reset();
        this.kycForm.get('statusreport')?.clearValidators();
      } else if (docType === 'statusreport') {
        ['form2', 'form7'].forEach((control) => {
          this.kycForm.get(control)?.reset();
          this.kycForm.get(control)?.clearValidators();
        });

        this.kycForm.get('statusreport')?.reset();
        this.kycForm.get('statusreport')?.setValidators([Validators.required]);
      }

      ['form2', 'form7', 'statusreport'].forEach((control) => {
        this.kycForm.get(control)?.updateValueAndValidity();
      });
    });
  }

  onSearch() {
    // console.log('search', this.clientCode.value);
  }

  openGuide(which: 'bvn' | 'nin') {
    const title =
      which === 'bvn' ? 'How to get your BVN' : 'How to get your NIN';
    const html =
      which === 'bvn'
        ? `
            <ul>
            <li data-hveid="CAEIABAH"><span class="T286Pc" data-sfc-cp="">Dial&nbsp;<strong class="Yjhzub">*565*0#</strong>&nbsp;on the phone number linked to your BVN.</span></li>
            <li data-hveid="CAEIABAI"><span class="T286Pc" data-sfc-cp="">A small service fee is charged for this transaction.</span></li>
            <li data-hveid="CAEIABAJ"><span class="T286Pc" data-sfc-cp="">Your BVN will appear on the screen.</span></li>
            <p>&nbsp;</p>
            <li data-hveid="CAEIABAJ"><span class="T286Pc" data-sfc-cp="">Alternatively, you can check your bank's mobile app or internet banking platform.</span></li>
            </ul>
          `
        : `<p>You can check your NIN by dialing <strong>*346#</strong> from the phone number linked to your account and following the on-screen prompts. Alternatively, you can find your NIN on the slip you received during enrollment </p>`;

    this.dialog.open(BvnNinGuideDialog, {
      data: { title, html },
      width: '520px',
    });
  }

  canSubmit(): boolean {
    // console.log('kycForm', this.kycForm);
    // console.log('foundClient', this.clientType);

    if (!this.clientType) return false;
    if (this.kycForm.invalid) return false;
    // if (this.bvnTaken) return false;
    return true;
  }

  onSubmit() {
    if (!this.canSubmit()) return;
    if (this.kycForm.invalid) return;

    // if (this.kycForm.get('bvn')?.value.trim() === this.clientType?.bvn?.trim()) {
    //   alert('BVN already exists in our system.');
    //   return;
    // } else {
    const payload = {
      ...this.kycForm.getRawValue(),
      customerCode: this.clientType,
      counter: this.clientType,
      form2: null,
      form7: null,
      cac: null,
      statusreport: null,
    };

    // if (environment.isDevelopment) console.log('payload', payload);
    this.loading = true;

    try {
      //
    } catch (error) {
      // console.log('Unable to complete KYC update', error);
      this.loading = false;
      this.isKycUpdated = false;
      this.snack.open('Failed to update KYC', 'Close', { duration: 3000 });
    }
  }

  ngOnDestroy(): void {
    console.log();
  }
}
