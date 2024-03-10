import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    constructor(private http: HttpClient) { }

    private apiUrl = `${environment.apiURL}PurchaseInvoice_New`;
    private getCustomerStatusNewURL = `${environment.apiURL}Customer?email=`;

    private Projectapi = `${environment.apiURL}DropDown/GetProject?id=0`;
    private PurchaseInvoice_New = `${environment.apiURL}PurchaseInvoice_New?email=`;
    private retry: any = retry(1); // Retry the request up to 2 times in case of failure
    private ApproveInvoiceURL = `${environment.apiURL}ApproveInvoice?email=`;
    private ApproverURL = `${environment.apiURL}ApproveInvoice`;
    private ApproverAccountURL = `${environment.apiURL}Account/GetInvoice?loginid=`;
    private GetCustomerAPI = `${environment.apiURL}DropDown/GetCustomer`;
    private GetCOAMasterAPI = `${environment.apiURL}DropDown/GetCOAMaster`;
    private GetGSTGroupAPI = `${environment.apiURL}DropDown/GetGSTGroup`;
    private GetHSNSACAPI = `${environment.apiURL}DropDown/GetHSNSAC?gstCode=`;
    private FILEDELETE = `${environment.apiURL}IMAD?imadId=`;
    private MailURL = `${environment.apiURL}Mail`;
    private CancelEmployeeURL = `${environment.apiURL}PurchaseInvoice_New/CancelEmployee`;
    private LastestEmailURL = `${environment.apiURL}Mail/LastestEmail?invoiceId=`;
    private InvoiceSummaryURL = `${environment.apiURL}NavERP/GetInvoiceSummary`;
    private TaxInvoiceInformationURL = `${environment.apiURL}NavERP/GetTaxInvoiceInformation`;
    private GetTaxInvoiceAttachmentURL = `${environment.apiURL}NavERP/GetTaxInvoiceAttachment`;

    GetTaxInvoiceAttachment(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetTaxInvoiceAttachmentURL}`).pipe(this.retry);
    }

    GetTaxInvoiceInformation(): Observable<any[]> {
        return this.http.get<any[]>(`${this.TaxInvoiceInformationURL}`).pipe(this.retry);
    }
    GetInvoiceSummary(): Observable<any[]> {
        return this.http.get<any[]>(`${this.InvoiceSummaryURL}`).pipe(this.retry);
    }
    IsLatestEmail(id: any): Observable<any[]> {
        const url = `${this.LastestEmailURL}${id}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }

    isCancelPI(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.CancelEmployeeURL}`, data).pipe(this.retry);
    }

    sendEmail(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.MailURL}`, formData).pipe(this.retry);
    }

    deleteFile(id: number): Observable<any> {
        return this.http.delete<any>(`${this.FILEDELETE}${id}`).pipe(this.retry);
    }

    getApproveInvoice(): Observable<any[]> {
        const url = `${this.ApproveInvoiceURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }

    GetHSNSACLIist(gstCode: any) {
        const url = `${this.GetHSNSACAPI}${gstCode}`;
        return this.http.get<any>(url);
    }
    GetGSTGroupList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetGSTGroupAPI}`).pipe(this.retry);
    }

    GetCOAMasterList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetCOAMasterAPI}`).pipe(this.retry);
    }

    GetCustomerList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetCustomerAPI}`).pipe(this.retry);
    }
    getApproveAccountInvoice(): Observable<any[]> {

        const url = `${this.ApproverAccountURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }

    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.Projectapi}`).pipe(this.retry);
    }

    getPurchaseInvoice_New(): Observable<any[]> {
        const url = `${this.PurchaseInvoice_New}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }

    create(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, formData).pipe(this.retry);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(this.retry);
    }
    getCustomerStatusNew(): Observable<any[]> {
        const url = `${this.getCustomerStatusNewURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }



    isApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURL}`, data).pipe(this.retry);
    }
}
