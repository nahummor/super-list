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
import { AddNewListComponent } from './super-list/add-new-list/add-new-list.component';
import { SnackBarMsgComponent } from './messages-box/snack-bar-msg/snack-bar-msg.component';
import { SppinerMsgBoxComponent } from './messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { ListContainerComponent } from './super-list/list-container/list-container.component';
import { ListItemComponent } from './super-list/list-item/list-item.component';
import { AddItemComponent } from './super-list/add-item/add-item.component';
import { YesNoMsgComponent } from './messages-box/yes-no-msg/yes-no-msg.component';
import { UpdateItemComponent } from './super-list/update-item/update-item.component';
import { SavedListComponent } from './super-list/saved-list/saved-list.component';
import { UpdateListDetailesComponent } from './super-list/update-list-detailes/update-list-detailes.component';
import { SharedListContainerComponent } from './super-list/shared-list-container/shared-list-container.component';
import { SavedSharedListComponent } from './super-list/saved-shared-list/saved-shared-list.component';
import { MainSharedUserListComponent } from './super-list/main-shared-user-list/main-shared-user-list.component';
import { SharedMyListComponent } from './super-list/shared-my-list/shared-my-list.component';
import { SharedUsersListComponent } from './super-list/shared-users-list/shared-users-list.component';
import { MySharedUsersComponent } from './super-list/my-shared-users/my-shared-users.component';
import { ShowSharedUserListComponent } from './super-list/show-shared-user-list/show-shared-user-list.component';
import { ShowSharedUserListConComponent } from './super-list/show-shared-user-list-container/show-shared-user-list-con.component';
import { CameraComponent } from './carera/camera.component';
import { ShowBigPictureComponent } from './show-big-picture/show-big-picture.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AddItemFromListComponent } from './super-list/add-item-from-list/add-item-from-list.component';
import { ItemFilterPipe } from './super-list/add-item-from-list/item-filter.pipe';
import { MessageComponent } from './admin-messages/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderMenuComponent,
    AppSidenavMenuComponent,
    ErrorMsgComponent,
    OkMsgComponent,
    MainComponent,
    AddNewListComponent,
    SnackBarMsgComponent,
    SppinerMsgBoxComponent,
    ListContainerComponent,
    ListItemComponent,
    AddItemComponent,
    YesNoMsgComponent,
    UpdateItemComponent,
    SavedListComponent,
    UpdateListDetailesComponent,
    SharedListContainerComponent,
    SavedSharedListComponent,
    MainSharedUserListComponent,
    SharedMyListComponent,
    SharedUsersListComponent,
    MySharedUsersComponent,
    ShowSharedUserListComponent,
    ShowSharedUserListConComponent,
    CameraComponent,
    ShowBigPictureComponent,
    PictureListComponent,
    AboutComponent,
    PrivacyComponent,
    AddItemFromListComponent,
    ItemFilterPipe,
    MessageComponent
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule
  ],
  entryComponents: [
    AddItemComponent,
    AddNewListComponent,
    ErrorMsgComponent,
    OkMsgComponent,
    SnackBarMsgComponent,
    SppinerMsgBoxComponent,
    UpdateItemComponent,
    UpdateListDetailesComponent,
    YesNoMsgComponent,
    ShowBigPictureComponent,
    MessageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
