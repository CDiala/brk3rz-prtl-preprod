import { Header } from '@insurFlow/shared';
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'lib-layout',
  imports: [
    Header,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    Sidenav,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  private platformId = inject(PLATFORM_ID);
  src = signal<string>('dashboard');

  // Breakpoint signal: true for mobile (< 768px), false for desktop (>= 768px)
  isMobile = signal<boolean>(false);

  async ngOnInit() {
    // Only set up window listeners on the browser
    if (isPlatformBrowser(this.platformId)) {
      // Set initial mobile state
      this.isMobile.set(window.innerWidth < 768);

      // Listen to window resize and update mobile signal
      window.addEventListener('resize', () => {
        this.isMobile.set(window.innerWidth < 768);
      });
    }
  }

  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  closeDrawerOnMobile() {
    if (this.isMobile() && this.drawer) {
      this.drawer.close();
    }
  }
}
