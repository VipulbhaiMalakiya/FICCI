import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { ForbiddenComponent } from './layouts/forbidden/forbidden.component';
import { LoginComponent } from './layouts/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { ApprproverEmailComponent } from './layouts/apprprover-email/apprprover-email.component';
import { NevErpComponent } from './layouts/nev-erp/nev-erp.component';
import { SalesMemoApproverEmailComponent } from './layouts/sales-memo-approver-email/sales-memo-approver-email.component';
import { InvoiceApprovalComponent } from './layouts/invoice-approval/invoice-approval.component';


const routes: Routes = [

    { path: 'UserName', component: NevErpComponent },

    { path: 'login', component: LoginComponent },

    {
        path:'approver/:email/:id',
        component:ApprproverEmailComponent,
    },
    {
        path:'approver/view/:email/:id',
        component:InvoiceApprovalComponent,
    },

    {
        path:'sales-approval/:email/:id',
        component:SalesMemoApproverEmailComponent,
    },

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
