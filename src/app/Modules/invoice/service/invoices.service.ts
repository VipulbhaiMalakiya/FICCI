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
    private ApproverAccountURL = `${environment.apiURL}Account/GetInvoice`;


    getApproveAccountInvoice(): Observable<any[]> {
        return this.http.get<any[]>(`${this.ApproverAccountURL}`).pipe(this.retry);
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

    getApproveInvoice(): Observable<any[]> {
        const url = `${this.ApproveInvoiceURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }

    isApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURL}`, data).pipe(this.retry);
    }
}
