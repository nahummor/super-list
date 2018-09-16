import { Subscription } from 'rxjs';
import { SuperListService } from './../../super-list/super-list.service';
import { AuthService } from './../../auth/auth.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nm-app-header-menu',
  templateUrl: './app-header-menu.component.html',
  styleUrls: ['./app-header-menu.component.scss']
})
export class AppHeaderMenuComponent implements OnInit, OnDestroy {
  @Output()
  sidenavToggle = new EventEmitter<void>();
  public displayUserName: string;
  public userRole: string;
  private userRoleSub: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.displayUserNameEvent.subscribe(userName => {
      this.displayUserName = userName;
    });
    this.userRoleSub = this.authService.userRoleEvent.subscribe(role => {
      this.userRole = role;
    });
  }

  ngOnDestroy() {
    this.userRoleSub.unsubscribe();
  }

  public onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  public onExit() {
    this.authService.logout();
  }

  public onLogin() {
    this.router.navigate(['/auth/login']);
  }

  public isUserAuth(): boolean {
    return this.authService.isUserAuth();
  }
}
