import { NewUserComponent } from './new-user/new-user.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';

const routes: Routes = [
  { path: 'auth/new-user', component: NewUserComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'userVerification', component: UserVerificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
