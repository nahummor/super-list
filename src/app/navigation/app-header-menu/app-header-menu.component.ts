import { AuthService } from './../../auth/auth.service';
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
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

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
