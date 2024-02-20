import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusCustomerComponent } from './component/customer-status/status-customer.component';
import { NewCustomerComponent } from './component/customer-new/new-customer.component';
import { ApprovalCustomerComponent } from './component/approval-inbox/approval-customer.component';
import { AccountsCustomerComponent } from './component/accounts-inbox/accounts-customer.component';
import { CustomerStatusComponent } from './View/customer-status/customer-status.component';
import { ApprovalRemarksComponent } from './Remarks/approval-remarks/approval-remarks.component';
import { AccountsRemarksComponent } from './Remarks/accounts-remarks/accounts-remarks.component';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'status', pathMatch: 'full' },
    {
        path: 'status', component: StatusCustomerComponent, canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Account'] },
    },
    {
        path: 'new', component: NewCustomerComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Account'] }
    },
    {
        path: 'approval', component: ApprovalCustomerComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver'] }
    },
    {
        path: 'accounts', component: AccountsCustomerComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Account'] }
    },
    {
        path: 'status/view/:id', component: CustomerStatusComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Account'] }
    },
    {
        path: 'status/edit/:id', component: NewCustomerComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Account'] }
    },
    {
        path: 'approval/remarks/:id', component: ApprovalRemarksComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Account'] }
    },
    {
        path: 'accounts/remarks/:id', component: AccountsRemarksComponent, canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Account'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
