import { Auth, AuthFacade } from '@insurFlow/auth-data';
import {
  Component,
  output,
  inject,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'lib-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav implements OnInit, OnDestroy {
  private router = inject(Router);
  protected authFacade = inject(AuthFacade);
  private subscription = new Subscription();
  protected currentRoute = signal<string>(this.router.url);
  protected credentials$ = this.authFacade.userMeRes$;
  authService: Auth = inject(Auth);
  protected navigationItems: NavItem[] = [
    {
      label: 'Client management',
      icon: 'manage_accounts',
      route: '/dashboard/clients',
    },
    {
      label: 'E-business',
      icon: 'safety_check',
      route: '/dashboard/ebusiness',
    },
    {
      label: 'Generate quote',
      icon: 'request_quote',
      route: '/dashboard/quotes',
    },
    {
      label: 'Submit claims',
      icon: 'garage_money',
      route: '/dashboard/claims',
    },
    {
      label: 'Support',
      icon: 'chat',
      route: '/dashboard/support',
    },
    {
      label: 'Track credit note',
      icon: 'credit_card_clock',
      route: '/dashboard/cnTrack',
    },
    { label: 'Commission', icon: 'payments', route: '/dashboard/commissions' },
    {
      label: 'Reports',
      icon: 'bar_chart_4_bars',
      route: '/dashboard/reports',
    },
  ];
  protected secondaryNavigationItems: NavItem[] = [
    { label: 'Settings', icon: 'settings', route: '/dashboard/settings' },
    { label: 'Logout', icon: 'logout', route: '/' },
  ];
  protected linkClicked = output<void>();

  ngOnInit() {
    this.getCurrentRoute();
    this.subscription.add(
      this.authService.dataListener().subscribe({
        next: (res) => {
          console.log('AuthREQ', res);
          if (res) {
          console.log('REQ', res);

          } else {
            this.subscription.add(
              this.credentials$.subscribe({
                next: (res) => {
                 
                  console.log('StateREQ', res);
                },
              })
            );
            // this.store.dispatch(
            //   HostActions.saveUserCredentials({ creds: res })
            // );
            //console.log('Budget auth', res);
          }
        },
      })
    );
  }

  getCurrentRoute() {
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.currentRoute.set(this.router.url);
        }),
    );
  }

  onLinkClick(event: Event) {
    event.stopPropagation();
    this.linkClicked.emit();
  }

  isLinkActive(route: string): boolean {
    return this.currentRoute().includes(route);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
