import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserAuthGet } from 'src/app/models';
import { AuthService, ModalService } from 'src/app/services';
import { Icons, logoutModalData } from 'src/app/util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SetIdDirective } from '../../../directives/set-id.directive';
import { IconComponent } from '../icon/icon.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BreadcrumbComponent, NgIf, IconComponent, SetIdDirective, MatTooltipModule, AsyncPipe],
})
export class MainHeaderComponent implements OnInit {
  Icons = Icons;

  setLoggedUser$: Observable<UserAuthGet | null | undefined> = of(null);

  constructor(private authService: AuthService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.setLoggedUser$ = this.authService.setLoggedUser$;
  }

  logout(): void {
    const ref = this.modalService.confirmation(logoutModalData());

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.authService.logout();
    });
  }
}