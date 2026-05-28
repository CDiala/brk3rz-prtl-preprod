import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'lib-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ]
})
export class DialogComponent implements OnInit {
  title!: string;
  @Output() sendNameToParent = new EventEmitter<string>();
  isTemplateRef!: boolean;
  buttonText!: string;
  cancelButton!: string;
  buttonAction: () => void;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private dialogRef: MatDialogRef<DialogComponent>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @angular-eslint/prefer-inject
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title || '';
    this.isTemplateRef = data.content instanceof TemplateRef;
    this.buttonText = data.buttonText || '';
    this.cancelButton = data.cancelButton || 'Cancel';
    // Define button action to close the dialog
    this.buttonAction = () => {
      if (data.buttonAction) {
       data.buttonAction(); // Execute the passed function
      }
      this.dialogRef.close(); // Close dialog and pass data
    };
  }

  ngOnInit() {
    console.log('');
  }

  selectNameFunc() {
    this.dialogRef.close();
  }
}
