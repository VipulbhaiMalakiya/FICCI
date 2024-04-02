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
import { NumberToWordsPipe1 } from './Pipe/numberToWords';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EmailComponent } from './send-email/email/email.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
import { PostedTaxInvoiceComponent } from './View/posted-tax-invoice/posted-tax-invoice.component';
import { PostedTextInvoiceComponent } from './component/posted-text-invoice/posted-text-invoice.component';
import { SearchFilterPipe1 } from './Pipe/searchFilter';
import { SearchFilterPipe2 } from './Pipe/searchpi';
import { PostedEmailComponent } from './send-email/posted-email/posted-email.component';
import { CreditmemoComponent } from './component/creditmemo/creditmemo.component';
import { PiInvoiceComponent } from './component/pi-invoice/pi-invoice.component';
import { PiInvoiceViewComponent } from './View/pi-invoice-view/pi-invoice-view.component';
import { CreditMemoStatusComponent } from './component/credit-memo-status/credit-memo-status.component';
import { CreditMemoViewComponent } from './View/credit-memo-view/credit-memo-view.component';
import { ApprovalSalesInboxComponent } from './component/approval-sales-inbox/approval-sales-inbox.component';
import { ViewSalesApprovalComponent } from './View/view-sales-approval/view-sales-approval.component';
import { PiInvoiceViewNewComponent } from './View/pi-invoice-view-new/pi-invoice-view-new.component';
import { PIEmailComponent } from './send-email/pi-email/pi-email.component';
import { CreditSalesEmailComponent } from './send-email/credit-sales-email/credit-sales-email.component';
import { SalesCreditNoteNavisionComponent } from './component/sales-credit-note-navision/sales-credit-note-navision.component';
import { SalesSearchFilterPipe } from './Pipe/sales-credite-pipe';
import { PostedSalesNoteNewComponent } from './View/posted-sales-note-new/posted-sales-note-new.component';
import { SalesCreditEmailComponent } from './send-email/sales-credit-email/sales-credit-email.component';
import { ValidationPopupComponent } from './View/validation-popup/validation-popup.component';


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
        CreditmemoComponent,
        PiInvoiceComponent,
        PiInvoiceViewComponent,
        CreditMemoStatusComponent,
        CreditMemoViewComponent,
        ApprovalSalesInboxComponent,
        ViewSalesApprovalComponent,
        PiInvoiceViewNewComponent,
        PIEmailComponent,
        CreditSalesEmailComponent,
        SalesCreditNoteNavisionComponent,
        SalesSearchFilterPipe,
        PostedSalesNoteNewComponent,
        SalesCreditEmailComponent,
        ValidationPopupComponent
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
