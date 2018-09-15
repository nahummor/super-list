import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {
  public userEmail: String;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail();
  }

  public onGoLogin() {
    this.router.navigate(['auth/login']);
  }

  public onSendVerificationEmail() {
    this.authService.sendVerificationEmail().then(() => {});
  }
}
