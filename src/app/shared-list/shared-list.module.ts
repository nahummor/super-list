import { SharedListContainerComponent } from './shared-list-container/shared-list-container.component';
import { NgModule } from '@angular/core';

import { SharedListRoutingModule } from './shared-list-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SharedMainComponent } from './shared-main/shared-main.component';
import { AddNewSharedListComponent } from './add-new-shared-list/add-new-shared-list.component';
import { SharedListItemComponent } from './shared-list-item/shared-list-item.component';
import { SharedSavedListComponent } from '../sheared-list/shared-saved-list/shared-saved-list.component';

@NgModule({
  declarations: [
    SharedMainComponent,
    AddNewSharedListComponent,
    SharedListContainerComponent,
    SharedListItemComponent,
    SharedSavedListComponent
  ],
  imports: [SharedListRoutingModule, SharedModule],
  entryComponents: [AddNewSharedListComponent]
})
export class SharedListModule {}
