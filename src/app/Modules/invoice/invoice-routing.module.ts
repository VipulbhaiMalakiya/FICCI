import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceStatusComponent } from './component/invoice-status/invoice-status.component';
import { NewPurchaseInvoiceComponent } from './component/new-purchase-invoice/new-purchase-invoice.component';
import { ApprovalInboxComponent } from './component/approval-inbox/approval-inbox.component';
import { AccountsInboxComponent } from './component/accounts-inbox/accounts-inbox.component';
import { ViewInvoiceStatusComponent } from './View/view-invoice-status/view-invoice-status.component';
import { ViewPiApprovalComponent } from './View/view-pi-approval/view-pi-approval.component';
import { ViewPiAccountsInboxComponent } from './View/view-pi-accounts-inbox/view-pi-accounts-inbox.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { EmailComponent } from './send-email/email/email.component';
import { PostedTaxInvoiceComponent } from './View/posted-tax-invoice/posted-tax-invoice.component';
import { PostedTextInvoiceComponent } from './component/posted-text-invoice/posted-text-invoice.component';
import { CreditmemoComponent } from './component/creditmemo/creditmemo.component';
import { PiInvoiceComponent } from './component/pi-invoice/pi-invoice.component';
import { CreditMemoStatusComponent } from './component/credit-memo-status/credit-memo-status.component';
import { CreditMemoViewComponent } from './View/credit-memo-view/credit-memo-view.component';
import { ApprovalSalesInboxComponent } from './component/approval-sales-inbox/approval-sales-inbox.component';

const routes: Routes = [
    { path: '', redirectTo: 'status', pathMatch: 'full' },
    {
        path: 'status', component: InvoiceStatusComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path: 'new', component: NewPurchaseInvoiceComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: [ 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path: 'approval', component: ApprovalInboxComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path: 'accounts', component: AccountsInboxComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path: 'status/view/:id', component: ViewInvoiceStatusComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path: 'status/edit/:id', component: NewPurchaseInvoiceComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path: 'approval/view/:id', component: ViewPiApprovalComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver'] }
    },
    {
        path: 'accounts/view/:id', component: ViewPiAccountsInboxComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin','Accounts'] }
    },
    {
        path:'accounts/email',
        component:EmailComponent,
        data: { expectedRoles: ['Accounts'] }
    },
    {
        path:'tax-invoice/view/:id',
        component:PostedTaxInvoiceComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'tax-invoice',
        component:PostedTextInvoiceComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'credit-memo',
        component:CreditmemoComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },{
        path:'pi-invoice',
        component:PiInvoiceComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'pi-invoice/view/:id',
        component:PostedTaxInvoiceComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'credit-memo-status',
        component:CreditMemoStatusComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'credit-memo-status/view/:id',
        component:CreditMemoViewComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'credit-memo-status/edit/:id',
        component:CreditmemoComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    },
    {
        path:'sales-approval',
        component:ApprovalSalesInboxComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['Admin', 'Approver', 'Employee', 'Accounts'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule { }
