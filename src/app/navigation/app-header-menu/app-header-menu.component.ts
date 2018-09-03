import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nm-app-header-menu',
  templateUrl: './app-header-menu.component.html',
  styleUrls: ['./app-header-menu.component.scss']
})
export class AppHeaderMenuComponent implements OnInit {
  @Output()
  sidenavToggle = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  public onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  public onExit() {
    console.log('Exit ...');
  }

  public onLogin() {
    console.log('Login .....');
  }

  public isUserAuth(): boolean {
    return true;
  }
}
