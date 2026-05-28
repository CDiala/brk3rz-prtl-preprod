/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EMIT_OPTION_ENUMS } from './attach-upload.enum';
import { NicePipe } from '@insurFlow/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-attach-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    NicePipe,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttachUpload),
      multi: true,
    },
  ],
  templateUrl: './attach-upload.component.html',
  styleUrl: './attach-upload.component.css',
})
export class AttachUpload implements OnDestroy {
  @Input() multiple = false; // Allow single/multiple file selection
  @Input() placeholder!: string;
  @Input() emitOption:
    | EMIT_OPTION_ENUMS.FILE
    | EMIT_OPTION_ENUMS.DATA
    | EMIT_OPTION_ENUMS.BOTH = EMIT_OPTION_ENUMS.FILE; // User can select what to emit: file, data, or both

  dataSheetControl = new FormControl('', Validators.required);
  fileList!: File[];
  subscription: Subscription = new Subscription();

  private onChange: OnChangeFn<File | File[] | null | string> = () => {};
  private onTouch: OnTouchedFn = () => {};

  getFile(fileControl: FormControl) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
    application/vnd.ms-excel,
    application/pdf,
    image/png,
    image/jpeg,
    text/csv
  `;
    input.multiple = this.multiple; // Enable selecting multiple files
    input.click();

    input.oncancel = () => {
      fileControl.setValue(null);
      // release dynamically created input field
      this.onTouch();
      input.remove();
    };

    input.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement)?.files;
    
      if (fileList) {
        const filesArray = Array.from(fileList); // Convert FileList to File[]
        const uniqueFiles = [
          ...(this.fileList || []), // Existing files
          ...filesArray, // Newly selected files
        ].filter(
          (file, index, self) =>
            self.findIndex((f) => f.name === file.name) === index // Remove duplicates
        );
    
        this.fileList = uniqueFiles; // Update fileList with unique files
        const fileNames = this.fileList.map((file) => file.name).join(', ');
    
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
