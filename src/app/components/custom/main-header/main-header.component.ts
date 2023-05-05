import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserAuthGet } from 'src/app/models';
import { AuthService, ModalService } from 'src/app/services';
import { Icons, logoutModalData } from 'src/app/util';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeaderComponent implements OnInit {
  Icons = Icons;

  setLoggedUser$: Observable<UserAuthGet | null | undefined> = of(null);

  constructor(private authService: AuthService, private modalService: ModalService) {}

  ngOnChanges(): void {
    console.warn(`mainheader changes!`);
  }

  ngOnInit(): void {
    this.setLoggedUser$ = this.authService.setLoggedUser$;
  }

  checkRender(): boolean {
    console.log('checkRender main header');
    return true;
  }

  logout(): void {
    const ref = this.modalService.confirmation(logoutModalData());

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.authService.logout();
    });
  }
}
