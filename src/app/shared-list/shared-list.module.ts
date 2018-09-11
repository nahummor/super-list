import { SharedSavedListComponent } from './shared-saved-list/shared-saved-list.component';
import { SharedListContainerComponent } from './shared-list-container/shared-list-container.component';
import { NgModule } from '@angular/core';

import { SharedListRoutingModule } from './shared-list-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SharedMainComponent } from './shared-main/shared-main.component';
import { AddNewSharedListComponent } from './add-new-shared-list/add-new-shared-list.component';
import { SharedListItemComponent } from './shared-list-item/shared-list-item.component';
import { UpdateSharedListDetailesComponent } from './update-shared-list-detailes/update-shared-list-detailes.component';
import { AddSharedItemComponent } from './add-shared-item/add-shared-item.component';
import { UpdateSharedItemComponent } from './update-shared-item/update-shared-item.component';

@NgModule({
  declarations: [
    SharedMainComponent,
    AddNewSharedListComponent,
    SharedListContainerComponent,
    SharedListItemComponent,
    SharedSavedListComponent,
    UpdateSharedListDetailesComponent,
    AddSharedItemComponent,
    UpdateSharedItemComponent
  ],
  imports: [SharedListRoutingModule, SharedModule],
  entryComponents: [
    AddNewSharedListComponent,
    UpdateSharedListDetailesComponent,
    AddSharedItemComponent,
    UpdateSharedItemComponent
  ]
})
export class SharedListModule {}
