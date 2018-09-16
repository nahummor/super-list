import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { NewUserComponent } from './new-user/new-user.component';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    NewUserComponent,
    LoginComponent,
    UserVerificationComponent,
    ResetPasswordComponent
  ],
  imports: [SharedModule, AuthRoutingModule],
  entryComponents: []
})
export class AuthModule {}
