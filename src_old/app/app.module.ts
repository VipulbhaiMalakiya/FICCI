import { NgModule, isDevMode } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent, SidebarLayoutComponent, BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule } from './import/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { ForbiddenComponent } from './layouts/forbidden/forbidden.component';
import { LoginComponent } from './layouts/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth-interceptor.interceptor';
import { SharedModule } from "./Modules/shared/shared.module";
import { ApprproverEmailComponent } from './layouts/apprprover-email/apprprover-email.component';
import { NevErpComponent } from './layouts/nev-erp/nev-erp.component';
import { SalesMemoApproverEmailComponent } from './layouts/sales-memo-approver-email/sales-memo-approver-email.component';
import { InvoiceApprovalComponent } from './layouts/invoice-approval/invoice-approval.component';
import { DatePipe } from '@angular/common';
import { DataSyncComponent } from './Modules/Masters/data-sync/data-sync.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarLayoutComponent,
        NotFoundComponent,
        ForbiddenComponent,
        LoginComponent,
        ApprproverEmailComponent,
        NevErpComponent,
        SalesMemoApproverEmailComponent,
        InvoiceApprovalComponent,
        DataSyncComponent,

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        DatePipe
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            progressAnimation: 'increasing',
            preventDuplicates: true,
            disableTimeOut:true,
        }),
        SharedModule
    ]
})
export class AppModule { }
