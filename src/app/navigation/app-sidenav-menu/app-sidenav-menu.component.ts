import { SuperListService } from './../../super-list/super-list.service';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nm-app-sidenav-menu',
  templateUrl: './app-sidenav-menu.component.html',
  styleUrls: ['./app-sidenav-menu.component.scss']
})
export class AppSidenavMenuComponent implements OnInit {
  @Output()
  closeSideNav = new EventEmitter<void>();
  public userRole: string;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  public onToggleSidenav() {
    this.closeSideNav.emit();
  }

  public isUserAuth(): boolean {
    return this.authService.isUserAuth();
  }

  public onExit() {
    this.closeSideNav.emit();
    this.authService.logout();
  }

  public onLogin() {
    this.closeSideNav.emit();
    this.router.navigate(['/auth/login']);
  }
}
