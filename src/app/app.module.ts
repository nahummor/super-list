import { AppRoutingModule } from './app.routing.module';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderMenuComponent } from './navigation/app-header-menu/app-header-menu.component';
import { AppSidenavMenuComponent } from './navigation/app-sidenav-menu/app-sidenav-menu.component';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent, AppHeaderMenuComponent, AppSidenavMenuComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
