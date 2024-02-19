import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { ForbiddenComponent } from './layouts/forbidden/forbidden.component';
import { LoginComponent } from './layouts/login/login.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
    {
        path: '',
        component: SidebarLayoutComponent,
        children: [
            {
                path: 'masters',
                children: [
                    { path: 'configuration-list', loadChildren: () => import('./Modules/Masters/configuration-list/configuration-list.module').then(m => m.ConfigurationListModule) },
                    { path: 'users', loadChildren: () => import('./Modules/Masters/users/users.module').then(m => m.UsersModule) },
                ]
            },
            { path: 'dashboard', loadChildren: () => import('./Modules/landing-page/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'customer', loadChildren: () => import('./Modules/customers/customers.module').then(m => m.CustomersModule) },
            { path: 'invoice', loadChildren: () => import('./Modules/invoice/invoice.module').then(m => m.InvoiceModule) },
        ]
    },
    { path: '404', component: NotFoundComponent },
    { path: '403', component: ForbiddenComponent },
    { path: '**', redirectTo: '/404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
