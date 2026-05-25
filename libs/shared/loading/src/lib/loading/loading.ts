import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './loading-service';

@Component({
  selector: 'lib-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading implements OnInit, OnDestroy {
  isLoading = false;
  private subscription: Subscription = new Subscription();
  private loadingService: LoadingService = inject(LoadingService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.subscription.add(
      this.loadingService.loadingSub.pipe(delay(0)).subscribe((loading) => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
