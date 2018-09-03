import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nm-app-sidenav-menu',
  templateUrl: './app-sidenav-menu.component.html',
  styleUrls: ['./app-sidenav-menu.component.scss']
})
export class AppSidenavMenuComponent implements OnInit {
  @Output()
  closeSideNav = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit() {}

  public onToggleSidenav() {
    this.closeSideNav.emit();
  }

  public isUserAuth(): boolean {
    return true;
  }

  public onExit() {
    this.closeSideNav.emit();
    this.router.navigate(['/auth/login']);
  }

  public onLogin() {
    this.closeSideNav.emit();
    // navigate to application
    console.log('Login....');
  }
}
