import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceStatusComponent } from './component/invoice-status/invoice-status.component';
import { NewPurchaseInvoiceComponent } from './component/new-purchase-invoice/new-purchase-invoice.component';
import { ApprovalInboxComponent } from './component/approval-inbox/approval-inbox.component';
import { AccountsInboxComponent } from './component/accounts-inbox/accounts-inbox.component';
import { ViewInvoiceStatusComponent } from './View/view-invoice-status/view-invoice-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPiApprovalComponent } from './View/view-pi-approval/view-pi-approval.component';
import { ViewPiAccountsInboxComponent } from './View/view-pi-accounts-inbox/view-pi-accounts-inbox.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NumberToWordsPipe1 } from './pipe/numberToWords';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EmailComponent } from './send-email/email/email.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
import { PostedTaxInvoiceComponent } from './View/posted-tax-invoice/posted-tax-invoice.component';
import { PostedTextInvoiceComponent } from './component/posted-text-invoice/posted-text-invoice.component';
import { SearchFilterPipe1 } from './pipe/searchFilter';
import { SearchFilterPipe2 } from './pipe/searchpi';
import { PostedEmailComponent } from './send-email/posted-email/posted-email.component';
import { CreditmemoComponent } from './component/creditmemo/creditmemo.component';



@NgModule({
    declarations: [
        InvoiceStatusComponent,
        NewPurchaseInvoiceComponent,
        ApprovalInboxComponent,
        AccountsInboxComponent,
        ViewInvoiceStatusComponent,
        NumberToWordsPipe1,
        ViewPiApprovalComponent,
        ViewPiAccountsInboxComponent,
        SearchFilterPipe1,
        EmailComponent,
        UpdateEmailComponent,
        PostedTaxInvoiceComponent,
        PostedTextInvoiceComponent,
        SearchFilterPipe2,
        PostedEmailComponent,
        CreditmemoComponent
    ],
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        SharedModule,
        NgxPaginationModule,
        AngularEditorModule,
    ]
})
export class InvoiceModule { }
