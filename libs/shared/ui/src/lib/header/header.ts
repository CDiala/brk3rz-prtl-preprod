import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
