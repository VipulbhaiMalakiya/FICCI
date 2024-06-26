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
    private deleteURL = `${environment.apiURL}Customer/Delete`;
    private GetPostCodeURL = `${environment.apiURL}DropDown/GetPostCode`;
    private gustomerTypeURL = `${environment.apiURL}DropDown/GstCustomerType`;
    private getCustomerStatusURL = `${environment.apiURL}Customer/0`;
    private getCustomerStatusNewURL = `${environment.apiURL}Customer?email=`;
    private ApproveCustomerURL = `${environment.apiURL}ApproveCustomer?email=`;
    private ApproverURL = `${environment.apiURL}ApproveCustomer`;
    // private AccountURL = `${environment.apiURL}ApproveCustomer?email=`; //Finance Approver
    private AccountURL = `${environment.apiURL}Account?loginid=`; // Account Approver
    private countryListURL = `${environment.apiURL}DropDown/GetCountry`;
    private GetStateURl = `${environment.apiURL}DropDown/GetState`;
    private GetCityURl = `${environment.apiURL}DropDown/GetCity`;
    private GetStatusList = `${environment.apiURL}Customer/GetStatusCustomerList`;
    private CheckGSTURL = `${environment.apiURL}CheckValidation/CheckGST?GST=`;
    private CheckPANURL = `${environment.apiURL}CheckValidation/CheckPAN?PAN=`;




    ValidateGST(data: any): Observable<any[]> {
        const url = `${this.CheckGSTURL}${data}`;
        return this.http.get<any[]>(url);
    }

    ValidatePAN(data: any): Observable<any[]> {
        const url = `${this.CheckPANURL}${data}`;
        return this.http.get<any[]>(url);
    }


    dashboardCustomerstatus(data: any): Observable<any> {
        return this.http.post<any>(`${this.GetStatusList}`, data);
    }

    getGstCustomerType(): Observable<any[]> {
        return this.http.get<any[]>(`${this.gustomerTypeURL}`);
    }

    getCountryList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.countryListURL}`);
    }

    getStateList(): Observable<any[]> {
        return this.http.get<any>(`${this.GetStateURl}`);
    }

    getCityList(): Observable<any[]> {
        return this.http.get<any>(`${this.GetCityURl}`);
    }

    getPostCodeList(): Observable<any[]> {
        return this.http.get<any>(`${this.GetPostCodeURL}`);
    }
    getCustomerStatus(): Observable<any[]> {
        return this.http.get<any[]>(`${this.getCustomerStatusURL}`);




    }
    create(data: addUpdateCustomer): Observable<addUpdateCustomer> {
        return this.http.post<addUpdateCustomer>(`${this.apiUrl}`, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.deleteURL}/${id}`);
    }

    getCustomerStatusNew(data: any): Observable<any[]> {

        console.log(data);

        const url = `${this.getCustomerStatusNewURL}${localStorage.getItem('userEmail') ?? ''}&departmentName=${localStorage.getItem('department') ?? ''}&start=${data.startDate}&end=${data.endDate}`;

        // const url = `${this.getCustomerStatusNewURL}${localStorage.getItem('userEmail') ?? ''}&departmentName=ABC`;

        //  https://localhost:44386/api/Customer?email=test%40te&departmentName=ABC
        return this.http.get<any[]>(url);
    }

    ApproveCustomer(): Observable<any[]> {
        const url = `${this.ApproveCustomerURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }


    isApproverRemarks(data: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.ApproverURL}`, data);
    }

    AccountsCustomer(): Observable<any[]> {
        const url = `${this.ApproveCustomerURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }

    getCustomerStatuaccount(): Observable<any[]> {
        const url = `${this.AccountURL}${localStorage.getItem('userEmail') ?? ''}`;
        return this.http.get<any[]>(url);
    }
}
