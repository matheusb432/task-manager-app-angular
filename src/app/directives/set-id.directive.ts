import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { us } from '../helpers';

@Directive({
  selector: '[appSetId]',
})
export class SetIdDirective implements OnInit {
  @Input() appSetId: unknown;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (typeof this.appSetId !== 'string' || !us.notEmpty(this.appSetId)) return;

    this.el.nativeElement.id = this.appSetId;
  }
}
