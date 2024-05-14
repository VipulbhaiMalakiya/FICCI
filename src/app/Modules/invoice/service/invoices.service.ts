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

    private ProjectapiCreditMemo = `${environment.apiURL}DropDown/GetProjectCreditMemo?id=0`;
    private Projectapi = `${environment.apiURL}DropDown/GetProject?department=`;
    private PurchaseInvoice_New = `${environment.apiURL}PurchaseInvoice_New?email=`;
    private ApproveInvoiceURL = `${environment.apiURL}ApproveInvoice?email=`;
    private ApproveSalesInvoiceURL = `${environment.apiURL}ApproveCredit?email=`;

    private ApproverURL = `${environment.apiURL}ApproveInvoice`;
    private ApproverAccountURL = `${environment.apiURL}Account/GetInvoice?loginid=`;
   // private GetCustomerAPI = `${environment.apiURL}DropDown/GetCustomer`;
    private GetCustomerAPI = `${environment.apiURL}NAVERP/GetCustomerInformation`;
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
    private SalesCreditNoteInformationURL = `${environment.apiURL}NavERP/GetSalesCreditNoteInformation?InvoiceNo=`;

    private TaxInvoiceInformationURL = `${environment.apiURL}NavERP/GetTaxInvoiceInformation?InvoiceNo=`;
    private GetTaxInvoiceAttachmentURL = `${environment.apiURL}NavERP/GetTaxInvoiceAttachment?InvoiceNo=`;
    private GetPITaxInvoiceAttachmentURL = `${environment.apiURL}NavERP/GetPIInvoiceAttachment?InvoiceNo=`;

    private ErpDetailCustNoURL = `${environment.apiURL}DropDown/ErpDetailCustNo?customerNo=`;
    private GstRegistrationNoURL = `${environment.apiURL}DropDown/GstRegistrationNo?gstNo=`;
    private GstRegistrationNoAllURL = `${environment.apiURL}DropDown/GstRegistrationNoAll`;

    private SalesCreditNoteSummaryURL = `${environment.apiURL}NavERP/GetSalesCreditNoteSummary?User=`;

    private PaymentDetailsURL = `${environment.apiURL}NavERP/GetTaxInvoicePaymentDetails?InvoiceNo=`;
    private GetDetailsURL = `${environment.apiURL}DropDown/GetDetails?projectCode=`;
    private GetApproverEmailURL = `${environment.apiURL}ApproveInvoice/GetApproverEmail?email=`;

    private CreditMemoApproverEmail = `${environment.apiURL}ApproveInvoice/GetApproverEmail?email=`;

    private ApproverURLNew = `${environment.apiURL}ApproveInvoice/MailInvoiceApproval`;
    private SalesApproverMailURL = `${environment.apiURL}ApproveCredit/MailSalesApproval`;

    private TotalCreditAmountURL = `${environment.apiURL}DropDown/TotalCreditAmount?invoiceNo=`;

    GetTotalCreditAmount(data: string): Observable<any[]> {
        const url = `${this.TotalCreditAmountURL}${data}`;
        return this.http.get<any[]>(url);
    }


    GetCreditMemoApproverEmail(data: any): Observable<any[]> {
        const url = `${this.CreditMemoApproverEmail}${data.email ?? ''}&id=${data.id    }`;
        return this.http.get<any[]>(url);
    }

    isApproverRemarksNew(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURLNew}`, data);
    }


    CreditNoteMailApproval(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.SalesApproverMailURL}`, data);
    }


    getApproveSalesInvoiceNew(data:any): Observable<any[]> {
        const url = `${this.ApproveSalesInvoiceURL}${data.email}`;
        return this.http.get<any[]>(url);
    }



    GetApproverEmail(data: any): Observable<any[]> {
        const url = `${this.GetApproverEmailURL}${data.email ?? ''}&id=${data.id    }`;
        return this.http.get<any[]>(url);
    }

    getGetDetails(data: any): Observable<any[]> {
        const url = `${this.GetDetailsURL}${data.projectCode ?? ''}&customerCode=${data.customerCode    }`;
        return this.http.get<any[]>(url);
    }

    GetSalesCreditNoteSummary(): Observable<any[]> {
        // return this.http.get<any[]>(`${this.InvoiceSummaryURL}`);
        const url = `${this.SalesCreditNoteSummaryURL}${sessionStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getTaxPaymentDetails(data: any): Observable<any[]> {

        const url = `${this.PaymentDetailsURL}${data ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getGstRegistrationNo(data: any): Observable<any[]> {
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
        const userEmail = sessionStorage.getItem('userEmail');
        const url = `${this.GetTaxInvoiceAttachmentURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }

    GetPITaxInvoiceAttachment(InvoiceNo: string): Observable<any[]> {
        const userEmail = sessionStorage.getItem('userEmail');
        const url = `${this.GetPITaxInvoiceAttachmentURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }


    GetTaxInvoiceInformation(InvoiceNo: string): Observable<any[]> {
        const url = `${this.TaxInvoiceInformationURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }

    GetPITaxInvoiceInformation(InvoiceNo: string): Observable<any[]> {
        const url = `${this.PITaxInvoiceInformationURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }


    GetSalesCreditNoteInformation(InvoiceNo: string): Observable<any[]> {
        const url = `${this.SalesCreditNoteInformationURL}${InvoiceNo}`;
        return this.http.get<any[]>(url);
    }

    GetInvoiceSummary(): Observable<any[]> {
        // return this.http.get<any[]>(`${this.InvoiceSummaryURL}`);
        const url = `${this.InvoiceSummaryURL}${sessionStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }
    GetPIInvoiceSummary(): Observable<any[]> {
        // return this.http.get<any[]>(`${this.InvoiceSummaryURL}`);
        const url = `${this.PIInvoiceSummaryURL}${sessionStorage.getItem('userEmail') ?? ''}`;
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
        const url = `${this.ApproveInvoiceURL}${sessionStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getApproveSalesInvoice(): Observable<any[]> {
        const url = `${this.ApproveSalesInvoiceURL}${sessionStorage.getItem('userEmail') ?? ''}`;
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

        const url = `${this.ApproverAccountURL}${sessionStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }


    getProjectsCreditMemo(): Observable<any[]> {
        return this.http.get<any[]>(`${this.ProjectapiCreditMemo}`);
    }

    getProjects(): Observable<any[]> {
      //  return this.http.get<any[]>(`${this.Projectapi}${sessionStorage.getItem('department')}&id=0`);

        return this.http.get<any[]>(`${this.Projectapi}${sessionStorage.getItem('navDepartment')}&id=0`);

    }

    getnavProjects(data:any){

        const encodedDepartment = encodeURIComponent(data);
       // console.log(encodedDepartment);

        return this.http.get<any[]>(`${this.Projectapi}${encodedDepartment}&id=0`);

    }


    getProjectsNav(): Observable<any[]> {
        //  return this.http.get<any[]>(`${this.Projectapi}${sessionStorage.getItem('department')}&id=0`);

          return this.http.get<any[]>(`${this.Projectapi}${sessionStorage.getItem('navDepartment')}&id=0`);

      }

    // getProjects(): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.Projectapi}`);
    // }

    getPurchaseInvoice_New(data:any): Observable<any[]> {
        console.log(data);
        
        const url = `${this.PurchaseInvoice_New}${sessionStorage.getItem('userEmail') ?? ''}&departmentName=${sessionStorage.getItem('navDepartment') ?? ''}&start=${data.startDate}&end=${data.endDate}`;
        return this.http.get<any[]>(url);
    }

    getSalesCreditMemo(): Observable<any[]> {
        const url = `${this.apiSalesCreditMemoUrl}${sessionStorage.getItem('userEmail') ?? ''}`;
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
        const url = `${this.getCustomerStatusNewURL}${sessionStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }



    isApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURL}`, data);
    }
    isSalesApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiApproveCreditUrl}`, data);
    }
}
