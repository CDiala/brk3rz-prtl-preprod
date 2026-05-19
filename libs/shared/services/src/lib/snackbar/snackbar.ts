import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Snackbar {
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  displaySnackBar(
    message: string,
    action: string,
    style1: string,
    style2 = 'login-snackbar',
  ) {
    return this._snackBar.open(message, action, {
      duration: 7000,
      panelClass: [style1, style2],
      // verticalPosition: 'top',
      // horizontalPosition: 'start',
    });
  }

  close() {
    this._snackBar.dismiss();
  }
}
