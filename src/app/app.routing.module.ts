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
  { path: 'savedList', canActivate: [AuthGuard], component: SavedListComponent }
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
