import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { NewUserComponent } from './new-user/new-user.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [NewUserComponent, LoginComponent],
  imports: [SharedModule, AuthRoutingModule]
})
export class AuthModule {}
