import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addUpdateCustomer } from '../interface/customers';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(private http: HttpClient) { }

    private apiUrl = `${environment.apiURL}Customer`;
    private countryListURL = `${environment.apiURL}DropDown/GetCountryList`;
    private GetStateURl = `${environment.apiURL}DropDown/GetStateByCountryId`;
    private GetCityURl = `${environment.apiURL}DropDown/GetCityByStateId`;
    private gustomerTypeURL = `${environment.apiURL}DropDown/GstCustomerType`;
    private getCustomerStatusURL = `${environment.apiURL}Customer/0`;
    private getCustomerStatusNewURL = `${environment.apiURL}Customer?email=`;
    private ApproveCustomerURL = `${environment.apiURL}ApproveCustomer?email=`;
    private ApproverURL = `${environment.apiURL}Approver`;


    private retry: any = retry(1); // Retry the request up to 2 times in case of failure

    getGstCustomerType(): Observable<any[]> {
        return this.http.get<any[]>(`${this.gustomerTypeURL}`).pipe(this.retry);
    }
    getCountryList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.countryListURL}`).pipe(this.retry);
    }

    getStateList(counrtyId: number): Observable<any[]> {
        return this.http.get<any>(`${this.GetStateURl}?counrtyId=${counrtyId}`);
    }

    getCityList(stateId: number): Observable<any[]> {
        return this.http.get<any>(`${this.GetCityURl}?stateId=${stateId}`);
    }
    getCustomerStatus(): Observable<any[]> {
        return this.http.get<any[]>(`${this.getCustomerStatusURL}`).pipe(this.retry);
    }
    create(data: addUpdateCustomer): Observable<addUpdateCustomer> {
        return this.http.post<addUpdateCustomer>(`${this.apiUrl}`, data).pipe(this.retry);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(this.retry);
    }

    getCustomerStatusNew(): Observable<any[]> {
        const url = `${this.getCustomerStatusNewURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }

    ApproveCustomer(): Observable<any[]> {
        const url = `${this.ApproveCustomerURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url).pipe(this.retry);
    }


    isApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURL}`, data).pipe(this.retry);
    }
}
