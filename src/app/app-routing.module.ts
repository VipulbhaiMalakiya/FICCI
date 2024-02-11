import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path:'master',
    component:SidebarLayoutComponent
  },
  { path: 'masters/configuration-list', loadChildren: () => import('./Modules/Masters/configuration-list/configuration-list.module').then(m => m.ConfigurationListModule) },
  { path: 'masters/users', loadChildren: () => import('./Modules/Masters/users/users.module').then(m => m.UsersModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
