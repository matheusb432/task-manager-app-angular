import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserAuthGet } from 'src/app/models/dtos/user';
import { AuthService, ModalService } from 'src/app/services';
import { Icons, logoutModalData } from 'src/app/utils';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
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
