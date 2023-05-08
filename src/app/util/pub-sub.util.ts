import { Component, Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

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
}
