import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';


const sidebarLayoutRoutes = [
  {
    path: '',
    component: SidebarLayoutComponent,
    children: [
      { path: 'configuration-list', loadChildren: () => import('./Modules/Masters/configuration-list/configuration-list.module').then(m => m.ConfigurationListModule) },
      { path: 'users', loadChildren: () => import('./Modules/Masters/users/users.module').then(m => m.UsersModule) },
      { path: 'new-customer', loadChildren: () => import('./Modules/customers/customers.module').then(m => m.CustomersModule) }
    ]
  }
];

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },


  { path: 'masters', children: sidebarLayoutRoutes },
  { path: 'customer', children: sidebarLayoutRoutes },
  { path: 'invoice', children: sidebarLayoutRoutes },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
