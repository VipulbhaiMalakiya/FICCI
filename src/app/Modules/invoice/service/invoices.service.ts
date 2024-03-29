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
    private apiApproveCreditUrl = `${environment.apiURL}ApproveCredit`;
    private apiSalesCreditMemoUrl = `${environment.apiURL}SalesCreditMemo?email=`;
    private apiUrlMemo = `${environment.apiURL}SalesCreditMemo`;
    private getCustomerStatusNewURL = `${environment.apiURL}Customer?email=`;

    private Projectapi = `${environment.apiURL}DropDown/GetProject?id=0`;
    private PurchaseInvoice_New = `${environment.apiURL}PurchaseInvoice_New?email=`;
    private ApproveInvoiceURL = `${environment.apiURL}ApproveInvoice?email=`;
    private ApproveSalesInvoiceURL = `${environment.apiURL}ApproveCredit?email=`;

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
    private InvoiceSummaryURL = `${environment.apiURL}NavERP/GetInvoiceSummary?User=`;
    private PIInvoiceSummaryURL = `${environment.apiURL}NavERP/GetPIInvoiceSummary?User=`;
    private PITaxInvoiceInformationURL = `${environment.apiURL}NavERP/GetPIInvoiceInformation?InvoiceNo=`;

    private TaxInvoiceInformationURL = `${environment.apiURL}NavERP/GetTaxInvoiceInformation?InvoiceNo=`;
    private GetTaxInvoiceAttachmentURL = `${environment.apiURL}NavERP/GetTaxInvoiceAttachment?InvoiceNo=`;
    private GetPITaxInvoiceAttachmentURL = `${environment.apiURL}NavERP/GetPIInvoiceAttachment?InvoiceNo=`;

    private ErpDetailCustNoURL = `${environment.apiURL}DropDown/ErpDetailCustNo?customerNo=`;
    private GstRegistrationNoURL = `${environment.apiURL}DropDown/GstRegistrationNo?gstNo=`;
    private GstRegistrationNoAllURL = `${environment.apiURL}DropDown/GstRegistrationNoAll`;

    getGstRegistrationNo(data:any): Observable<any[]> {
        const url = `${this.GstRegistrationNoURL}${data.gst ?? ''}&code=${data.code}`;
        return this.http.get<any[]>(url);
    }

    GstRegistrationNoAll(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GstRegistrationNoAllURL}`);
    }


    getErpDetailCustNo(customerNo: any): Observable<any[]> {
        const url = `${this.ErpDetailCustNoURL}${customerNo ?? ''}`;
        return this.http.get<any[]>(url);
    }

    GetTaxInvoiceAttachment(InvoiceNo: string): Observable<any[]> {
        const userEmail = localStorage.getItem('userEmail');
        const url = `${this.GetTaxInvoiceAttachmentURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
      }

      GetPITaxInvoiceAttachment(InvoiceNo: string): Observable<any[]> {
        const userEmail = localStorage.getItem('userEmail');
        const url = `${this.GetPITaxInvoiceAttachmentURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
      }


    GetTaxInvoiceInformation(InvoiceNo:string): Observable<any[]> {
        const url = `${this.TaxInvoiceInformationURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }

    GetPITaxInvoiceInformation(InvoiceNo:string): Observable<any[]> {
        const url = `${this.PITaxInvoiceInformationURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }

    GetInvoiceSummary(): Observable<any[]> {
        // return this.http.get<any[]>(`${this.InvoiceSummaryURL}`);
        const url = `${this.InvoiceSummaryURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }
    GetPIInvoiceSummary(): Observable<any[]> {
        // return this.http.get<any[]>(`${this.InvoiceSummaryURL}`);
        const url = `${this.PIInvoiceSummaryURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }
    IsLatestEmail(id: any): Observable<any[]> {
        const url = `${this.LastestEmailURL}${id}`;
        return this.http.get<any[]>(url);
    }

    isCancelPI(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.CancelEmployeeURL}`, data);
    }

    sendEmail(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.MailURL}`, formData);
    }

    deleteFile(id: number): Observable<any> {
        return this.http.delete<any>(`${this.FILEDELETE}${id}`);
    }

    getApproveInvoice(): Observable<any[]> {
        const url = `${this.ApproveInvoiceURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getApproveSalesInvoice(): Observable<any[]> {
        const url = `${this.ApproveSalesInvoiceURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    GetHSNSACLIist(gstCode: any) {
        const url = `${this.GetHSNSACAPI}${gstCode}`;
        return this.http.get<any>(url);
    }
    GetGSTGroupList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetGSTGroupAPI}`);
    }

    GetCOAMasterList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetCOAMasterAPI}`);
    }

    GetCustomerList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetCustomerAPI}`);
    }
    getApproveAccountInvoice(): Observable<any[]> {

        const url = `${this.ApproverAccountURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.Projectapi}`);
    }

    getPurchaseInvoice_New(): Observable<any[]> {
        const url = `${this.PurchaseInvoice_New}${localStorage.getItem('userEmail') ?? ''}&departmentName=${localStorage.getItem('department') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getSalesCreditMemo(): Observable<any[]> {
        const url = `${this.apiSalesCreditMemoUrl}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    create(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, formData);
    }

    createMemo(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrlMemo}`, formData);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
    getCustomerStatusNew(): Observable<any[]> {
        const url = `${this.getCustomerStatusNewURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }



    isApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURL}`, data);
    }
    isSalesApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiApproveCreditUrl}`, data);
    }
}
