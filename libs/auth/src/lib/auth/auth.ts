import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadAuthSuccess } from '../+state/auth.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'lib-auth',
  imports: [MatButtonModule, MatInputModule, MatFormField],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(
      loadAuthSuccess({
        auth: [
          {
            id: 0,
            name: 'buzz lightyear',
          },
        ],
      }),
    );
  }
}
