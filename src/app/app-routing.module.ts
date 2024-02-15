import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  {
    path: 'masters',
    component: SidebarLayoutComponent,
    children: [
      { path: 'configuration-list', loadChildren: () => import('./Modules/Masters/configuration-list/configuration-list.module').then(m => m.ConfigurationListModule) },
      { path: 'users', loadChildren: () => import('./Modules/Masters/users/users.module').then(m => m.UsersModule) },
    ]
  },
  { path: 'customer', component: SidebarLayoutComponent, loadChildren: () => import('./Modules/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'invoice', component: SidebarLayoutComponent, loadChildren: () => import('./Modules/invoice/invoice.module').then(m => m.InvoiceModule) },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
