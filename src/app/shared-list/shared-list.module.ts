import { NgModule } from '@angular/core';

import { SharedListRoutingModule } from './shared-list-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SharedMainComponent } from './shared-main/shared-main.component';

@NgModule({
  declarations: [SharedMainComponent],
  imports: [SharedListRoutingModule, SharedModule]
})
export class SharedListModule {}
