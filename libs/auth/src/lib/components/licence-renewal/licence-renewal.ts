/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AttachUpload, ButtonComponent } from '@insurFlow/shared';
import { AuthRequest, EMAIL_REGEX, useCredForUpload } from '@insurFlow/core';
import { PasswordHintComponent } from '../password-hint/password-hint';
import { filter, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import {
  AuthFacade,
  loginUser,
  selectAuthError,
  selectAuthUserId,
  selectUsernameRes,
  uploadLicence,
  uploadLicenceRes,
  userAuthId,
  userSuccessResponse,
} from '@insurFlow/auth-data';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from '../../../../../shared/ui/src/lib/dialog/dialog.component';
import {
  getNameUser,
  uploadLicenceSuccess,
} from '../../../../../auth-data/src/lib/+state/auth.actions';
import * as AuthActions from '../../../../../auth-data/src/lib/+state/auth.actions';
@Component({
  selector: 'lib-licence-renewal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    ButtonComponent,
    DialogComponent,
    AttachUpload,
  ],
  templateUrl: './licence-renewal.html',
  styleUrl: './licence-renewal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenceRenewal implements AfterViewInit, OnDestroy {
  protected licenceForm!: FormGroup;
  protected hidePassword = signal(true);
  protected isLoading = signal(false);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private authFacade = inject(AuthFacade);
  private subscription = new Subscription();
  @ViewChild('errorTemplate') errorTemplate!: TemplateRef<string>;
  protected loginError = '';
  protected uploadedFile = new FormControl([], Validators.required);
  protected uploadedFiles: File[] = [];
  #facade = inject(AuthFacade);
  userErrorId$ = this.#facade.userErrorId$;
  userId: string | null = null;
  retrievedName: string | null = null;
  private destroy$ = new Subject<void>();
  protected supportFiles: object[] = [];
  @ViewChild('fileUploadComponent') fileUploadComponent!: AttachUpload;

  constructor() {
    this.createForm();
    this.subscription.add(
      this.uploadedFile.valueChanges.subscribe((evt) => {
        // console.log('evtFile', evt);
        this.uploadedFiles = (evt as File[]) || [];
      }),
    );
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      this.authFacade.uploadLicenceRes$.subscribe({
        next: (res) => {
          console.log('res', res);
          if (res) {
            this.resetFileUpload();
            // this.licenceForm.reset();
          }
        },
      }),
    );

    this.subscription.add(
      this.store.select(selectAuthError).subscribe((error) => {
        if (error === 'Invalid request') {
          this.loginError =
            'Your licence has expired. Proceed to upload a new licence to regain access.';
          this.openDialog(this.errorTemplate);
        } else if (error) {
          this.loginError = error;

          this.openSpecialDialog(this.errorTemplate);
        }
      }),
    );

    this.userErrorId$ = this.store.select(selectAuthUserId);
    this.subscription.add(
      this.userErrorId$.subscribe((userId) => {
        console.log('userId', userId);
        this.userId = userId?.userId || null;
      }),
    );
    this.licenceForm.get('userId')?.patchValue(this.userId);

    this.store.dispatch(
      AuthActions.getNameUser({ userId: this.userId as string }),
    );

    this.store
      .select(selectUsernameRes)
      .pipe(
        filter((res) => !!res), // Safe guard check to skip initial null states
        takeUntil(this.destroy$),
      )
      .subscribe((res: userSuccessResponse) => {
        // Drill down into your response object payload keys
        // Adjust '.name' or '.data' to match your exact backend response keys
        this.retrievedName = res.data?.companyName;
        this.licenceForm.get('companyName')?.patchValue(this.retrievedName);

        console.log('Username successfully received:', this.retrievedName);
      });
    this.checkLogin();
  }

  get companyName() {
    return this.licenceForm.get('companyName') as FormControl;
  }

  get userIdM() {
    return this.licenceForm.get('userId') as FormControl;
  }

  createForm() {
    this.licenceForm = this.fb.group({
      companyName: new FormControl(''),
      userId: new FormControl(''),
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword);
  }

  async onSubmit(): Promise<void> {
    if (this.licenceForm.valid) {
      this.isLoading.set(true);
      const formData = new FormData();

      const credentials: useCredForUpload = {
        userId: this.licenceForm.value.userId,
        companyName: this.licenceForm.value.companyName,
      };
      console.log('LicenceCredentials', credentials);
      formData.append('userId', credentials.userId);
      Object.values(this.uploadedFiles).forEach((item) => {
        console.log('Support File', item);

        formData.append('file', item as File);
      });

      this.store.dispatch(uploadLicence({ formData }));
    }
  }

  checkLogin() {
    this.subscription.add(
      this.authFacade.uploadLicenceRes$.subscribe({
        next: (res) => {
          console.log('res', res);

          if (res || res === null) {
            this.isLoading.set(false);
          }

          console.log('this.isLoading', this.isLoading, typeof res);
        },
      }),
    );
  }
  viewPasswordHint(event: Event): void {
    event.stopPropagation();
    this.dialog.open(PasswordHintComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSpecialDialog(template: TemplateRef<any>) {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '400px',
      data: {
        title: '',
        content: template,
        cancelButton: 'Close',
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openDialog(template: TemplateRef<any>) {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '400px',
      data: {
        title: '',
        content: template,
        cancelButton: 'Proceed',
      },
    });
  }

  get isSubmitDisabled(): boolean {
    return !this.licenceForm.valid || this.uploadedFiles.length === 0;
  }

  resetFileUpload(): void {
    this.fileUploadComponent.resetFiles(); // Directly call resetFiles
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
