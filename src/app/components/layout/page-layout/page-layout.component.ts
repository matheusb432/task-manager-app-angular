import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {

  @ViewChild('pageContent') pageContent: any;

  constructor() {}

  ngOnInit() {}

}
