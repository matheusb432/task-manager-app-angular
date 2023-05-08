import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubSubUtil {
  static unsub(subscriptions: Subscription[]): void {
    if (!subscriptions?.length) return;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  static completeDestroy(destroyed$: Subject<boolean>): void {
    destroyed$.next(true);
    destroyed$.complete();
  }

  static untilDestroyed<T>(source: Observable<T>, destroyed$: Subject<boolean>): Observable<T> {
    return source.pipe(takeUntil(destroyed$));
  }
}
