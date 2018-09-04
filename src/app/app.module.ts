import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app.routing.module';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderMenuComponent } from './navigation/app-header-menu/app-header-menu.component';
import { AppSidenavMenuComponent } from './navigation/app-sidenav-menu/app-sidenav-menu.component';
import { AuthModule } from './auth/auth.module';
import { ErrorMsgComponent } from './messages-box/error-msg/error-msg.component';
import { OkMsgComponent } from './messages-box/ok-msg/ok-msg.component';
import { MainComponent } from './super-list/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderMenuComponent,
    AppSidenavMenuComponent,
    ErrorMsgComponent,
    OkMsgComponent,
    MainComponent
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule
  ],
  entryComponents: [ErrorMsgComponent, OkMsgComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
