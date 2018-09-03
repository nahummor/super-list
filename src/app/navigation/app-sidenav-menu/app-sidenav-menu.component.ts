import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nm-app-sidenav-menu',
  templateUrl: './app-sidenav-menu.component.html',
  styleUrls: ['./app-sidenav-menu.component.scss']
})
export class AppSidenavMenuComponent implements OnInit {
  @Output()
  closeSideNav = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  public onToggleSidenav() {
    this.closeSideNav.emit();
  }

  public isUserAuth(): boolean {
    return true;
  }

  public onExit() {
    console.log('Exit.....');
  }

  public onLogin() {
    console.log('Login....');
  }
}
