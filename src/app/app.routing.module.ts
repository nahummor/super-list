import { SharedMyListComponent } from './super-list/shared-my-list/shared-my-list.component';
import { MainSharedUserListComponent } from './super-list/main-shared-user-list/main-shared-user-list.component';
import { SavedSharedListComponent } from './super-list/saved-shared-list/saved-shared-list.component';
import { SharedListContainerComponent } from './super-list/shared-list-container/shared-list-container.component';
import { SavedListComponent } from './super-list/saved-list/saved-list.component';
import { AuthGuard } from './auth/auth.guard';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './super-list/main/main.component';
import { ListContainerComponent } from './super-list/list-container/list-container.component';

const routes: Routes = [
  { path: 'main', canActivate: [AuthGuard], component: MainComponent },
  {
    path: 'listContainer/:name/:description/:id',
    canActivate: [AuthGuard],
    component: ListContainerComponent
  },
  {
    path: 'savedList',
    canActivate: [AuthGuard],
    component: SavedListComponent
  },
  {
    path: 'sharedList',
    canLoad: [AuthGuard],
    loadChildren: './shared-list/shared-list.module#SharedListModule'
  },
  {
    path: 'savedSharedList',
    canActivate: [AuthGuard],
    component: SavedSharedListComponent
  },
  {
    path: 'sharedListContainer',
    canActivate: [AuthGuard],
    component: SharedListContainerComponent
  },
  {
    path: 'mainSharedUserList',
    canActivate: [AuthGuard],
    component: MainSharedUserListComponent
  },
  {
    path: 'sharedMyList',
    canActivate: [AuthGuard],
    component: SharedMyListComponent
  }

  // { path: 'path/:routeParam', component: MyComponent },
  // { path: 'staticPath', component: ... },
  // { path: '**', component: ... },
  // { path: 'oldPath', redirectTo: '/staticPath' },
  // { path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
