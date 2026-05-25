import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  html: string;
}

@Component({
  selector: 'lib-bvn-nin-guide-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
  ],
  templateUrl: './bvn-nin-guide-dialog.html',
  styleUrl: './bvn-nin-guide-dialog.css',
})
export class BvnNinGuideDialog {
  // Clean, typed property using the interface
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  // constructor(
  //   @Inject(MAT_DIALOG_DATA) public data: { title: string; html: string },
  // ) {}
}
