import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import {
  ButtonComponent,
  CardComponent,
  BadgeComponent,
  StatBlockComponent,
} from '@insurFlow/shared';

@Component({
  selector: 'lib-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    StatBlockComponent,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private router = inject(Router);
  protected year = new Date().getFullYear();

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
