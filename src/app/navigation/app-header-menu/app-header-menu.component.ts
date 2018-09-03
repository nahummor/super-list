import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nm-app-header-menu',
  templateUrl: './app-header-menu.component.html',
  styleUrls: ['./app-header-menu.component.scss']
})
export class AppHeaderMenuComponent implements OnInit {
  @Output()
  sidenavToggle = new EventEmitter<void>();
  constructor(private router: Router) {}

  ngOnInit() {}

  public onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  public onExit() {
    this.router.navigate(['auth/login']); // navigate to login component
  }

  public onLogin() {
    console.log('Login .....');
  }

  public isUserAuth(): boolean {
    return true;
  }
}
