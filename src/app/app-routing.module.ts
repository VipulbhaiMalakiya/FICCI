import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { ForbiddenComponent } from './layouts/forbidden/forbidden.component';
import { LoginComponent } from './layouts/login/login.component';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: SidebarLayoutComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver','Employee','Accounts'] }, // Define multiple expected roles

        children: [
            {
                path: 'masters',
                canActivate: [AuthGuard],
                data: { expectedRoles: ['Admin'] },
                children: [
                    { path: 'configuration-list', loadChildren: () => import('./Modules/Masters/configuration-list/configuration-list.module').then(m => m.ConfigurationListModule) },
                    { path: 'users', loadChildren: () => import('./Modules/Masters/users/users.module').then(m => m.UsersModule) },
                ]
            },
            {path: '',redirectTo: 'dashboard',pathMatch: 'full'},

            { path: 'dashboard', loadChildren: () => import('./Modules/landing-page/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'customer', loadChildren: () => import('./Modules/customers/customers.module').then(m => m.CustomersModule) },
            { path: 'invoice', loadChildren: () => import('./Modules/invoice/invoice.module').then(m => m.InvoiceModule) },

        ]
    },
    { path: '404', component: NotFoundComponent },
    { path: 'unauthorized', component: ForbiddenComponent },
    { path: '**', redirectTo: '/404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
