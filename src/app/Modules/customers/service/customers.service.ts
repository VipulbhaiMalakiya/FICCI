import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addUpdateCustomers } from '../interface/customers';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiURL}Customer` ;
  private countryListURL = `${environment.apiURL}DropDown/GetCountryList` ;
  private GetStateURl = `${environment.apiURL}DropDown/GetStateByCountryId` ;
  private GetCityURl = `${environment.apiURL}DropDown/GetCityByStateId` ;
  private gustomerTypeURL = `${environment.apiURL}DropDown/GstCustomerType` ;
  private  retry:any =  retry(1); // Retry the request up to 2 times in case of failure

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
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(this.retry);
  }
  create(data: addUpdateCustomers): Observable<addUpdateCustomers> {
    return this.http.post<addUpdateCustomers>(`${this.apiUrl}`, data).pipe(this.retry);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(this.retry);
  }
}
