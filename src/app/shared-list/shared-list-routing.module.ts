import { SharedSavedListComponent } from './shared-saved-list/shared-saved-list.component';
import { SharedMainComponent } from './shared-main/shared-main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedListContainerComponent } from './shared-list-container/shared-list-container.component';

const routes: Routes = [
  { path: 'main', component: SharedMainComponent },
  {
    path: 'listContainer/:name/:description',
    component: SharedListContainerComponent
  },
  { path: 'savedList', component: SharedSavedListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedListRoutingModule {}
