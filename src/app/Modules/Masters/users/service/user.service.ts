import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addUpdateEmployees } from '../import';
import { addUpdateConfiguration } from '../../configuration-list/import';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private RolesList = `${environment.apiURL}DropDown/GetRole`;
    private EmployeeList = `${environment.apiURL}DropDown/GetEmployeeList`;
    private apiUrl = `${environment.apiURL}FICCI_User_Master/0`;
    private apiUrl1 = `${environment.apiURL}FICCI_User_Master`;
    private deleteapiUrl = `${environment.apiURL}FICCI_User_Master`;
    private postAPIURL = `${environment.apiURL}FICCI_User_Master`;
    private GetDepartmentIURL = `${environment.apiURL}DropDown/GetDepartment`;
    private syncCountryUrl = `${environment.apiURL}NavERP/GetCountry`;
    private syncStateUrl = `${environment.apiURL}NavERP/GetState`;
    private syncCityUrl = `${environment.apiURL}NavERP/GetCity`;
    private retry: any = retry(1); // Retry the request up to 2 times in case of failure

    constructor(private http: HttpClient) { }


    syncCountry(): Observable<any[]> {
        return this.http.get<any[]>(`${this.syncCountryUrl}`);
    }
    syncState(): Observable<any[]> {
        return this.http.get<any[]>(`${this.syncStateUrl}`);
    }
    syncCity(): Observable<any[]> {
        return this.http.get<any[]>(`${this.syncCityUrl}`);
    }

    public GetDepartment(): Observable<any[]> {
        return this.http.get<any[]>(`${this.GetDepartmentIURL}`);
    }

    public getRoles(): Observable<any[]> {
        return this.http.get<any[]>(`${this.RolesList}`);
    }
    getUserById(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl1}/${userId}`);
    }
    // getUserById(userId: number): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}?IMEM_ID=${userId}`);
    // }
    getEmployee(): Observable<any[]> {
        return this.http.get<any[]>(`${this.EmployeeList}`);
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }


    create(data: addUpdateEmployees): Observable<addUpdateConfiguration> {
        return this.http.post<addUpdateConfiguration>(`${this.postAPIURL}`, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.deleteapiUrl}/${id}`);
    }

}
