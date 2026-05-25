/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EMIT_OPTION_ENUMS } from './upload.enum';
import { NicePipe } from '@insurFlow/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { maxFileSize } from '@insurFlow/core';

@Component({
  selector: 'lib-upload',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    NicePipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Upload),
      multi: true,
    },
  ],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload implements OnDestroy {
  @Input() multiple = false; // Allow single/multiple file selection
  @Input() placeholder!: string;
  @Input() acccept!: string;
  @Input() accceptedDocuments!: string;
  @Input() emitOption:
    | EMIT_OPTION_ENUMS.FILE
    | EMIT_OPTION_ENUMS.DATA
    | EMIT_OPTION_ENUMS.BOTH = EMIT_OPTION_ENUMS.FILE; // User can select what to emit: file, data, or both
  @Output() fakePath: EventEmitter<string> = new EventEmitter<string>();

  dataSheetControl = new FormControl('', Validators.required);
  fileList!: File[];
  subscription: Subscription = new Subscription();
  selectedFile: File[] | null = null;
  fileContent: string | ArrayBuffer | null = null;

  private onChange: OnChangeFn<File | File[] | null | string> = () => {};
  private onTouch: OnTouchedFn = () => {};

  getFile(fileControl: FormControl) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept =
      this.acccept ??
      `
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
    application/vnd.ms-excel,
    application/pdf,
    image/png,
    image/jpeg,
    image/webp,
    text/csv
  `;
    input.multiple = this.multiple; // Enable selecting multiple files
    input.click();

    // console.log('control', this.dataSheetControl);
    input.oncancel = () => {
      if (this.fileList) this.fileList.length = 0;
      this.onChange(this.fileList); // Notify changes
      fileControl.setValue(null);
      // release dynamically created input field
      this.onTouch();
      input.remove();
    };

    input.onchange = (e) => {
      // clear file list
      this.fileList = [];
      this.onFileSelected(e);

      const fileList = (e.target as HTMLInputElement)?.files;

      if (fileList) {
        const filesArray = Array.from(fileList); // Convert FileList to File[]
        const uniqueFiles = [
          ...(this.fileList || []), // Existing files
          ...filesArray, // Newly selected files
        ].filter(
          (file, index, self) =>
            self.findIndex((f) => f.name === file.name) === index, // Remove duplicates
        );

        this.fileList = uniqueFiles; // Update fileList with unique files
        const fileNames = this.fileList.map((file) => file.name).join(', ');

        // check file type & size
        const allowedTypes = this.acccept.split(',');
        let wrongFileTypeCount = 0;
        let largeFileSizeCount = 0;

        uniqueFiles.forEach((file) => {
          if (!allowedTypes.includes(file.type)) {
            wrongFileTypeCount++;
            this.removeFile(file.name);
          }

          if (file.size > maxFileSize * 1024 * 1024) {
            largeFileSizeCount++;
            this.removeFile(file.name);
          }
        });

        // reset file input if there are any wrong file types or large files
        if (wrongFileTypeCount > 0) {
          alert(
            `Wrong file type detected for ${wrongFileTypeCount} files. Allowed file types: ${this.accceptedDocuments}`,
          );
          fileControl.setValue(null);
          return;
        }

        if (largeFileSizeCount > 0) {
          alert(
            `Large file size detected for ${largeFileSizeCount} file(s). File size shouldn't exceed ${maxFileSize}mb`,
          );
          fileControl.setValue(null);
          return;
        }

        fileControl.setValue(fileNames); // Display file names in the input field

        this.onChange(this.fileList); // Notify changes
      }
    };
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // this.isFileUploaded = isDisabled;
  }

  writeValue(value: any): void {}

  preview(value: string, index: number): void {
    // console.log('file:', value);

    if (this.fileList[index]) {
      const fileURL = URL.createObjectURL(this.fileList[index]);
      window.open(fileURL, '_blank');

      // Revoke the object URL after the new tab has been opened
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 100);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const fakePath = input.value; // Get the fake path
      // console.log('Fake Path:', fakePath);
      this.fakePath.emit(fakePath);
    }
  }

  removeFile(fileName: string) {
    // Filter out the file to be removed
    this.fileList = this.fileList.filter((file) => file.name !== fileName);

    // Update the FormControl value with remaining file names
    const updatedFileNames = this.fileList.map((file) => file.name).join(', ');
    this.dataSheetControl.setValue(updatedFileNames);

    this.onTouch();
    this.onChange(this.fileList);
  }

  resetFiles(): void {
    this.fileList = []; // Clear the file list
    this.dataSheetControl.reset(''); // Reset the FormControl value
    this.onChange(null); // Notify parent of the reset state
    this.onTouch(); // Mark the control as touched
  }

  emitFile(file: File) {
    this.onTouch();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

type OnChangeFn<T> = (value: T) => void;
type OnTouchedFn = () => void;
