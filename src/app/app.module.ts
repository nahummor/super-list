import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderMenuComponent } from './navigation/app-header-menu/app-header-menu.component';
import { AppSidenavMenuComponent } from './navigation/app-sidenav-menu/app-sidenav-menu.component';

@NgModule({
  declarations: [AppComponent, AppHeaderMenuComponent, AppSidenavMenuComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
