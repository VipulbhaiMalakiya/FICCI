import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configuration, addUpdateConfiguration } from '../interface/configuration';
import { Category } from '../interface/category';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private apiUrl = `${environment.apiURL}Configuration/0` ;
  private categoryListUrl = `${environment.apiURL}DropDown/GetCategory` ;
  private postURL = `${environment.apiURL}Configuration`;
  private deleteURL = `${environment.apiURL}Configuration`;
  private  retry:any =  retry(1); // Retry the request up to 2 times in case of failure
  constructor(private http: HttpClient) {}

  getCategoryList(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryListUrl).pipe(this.retry);
  }
  getAll(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(`${this.apiUrl}`).pipe(this.retry);
  }

  create(data: addUpdateConfiguration): Observable<addUpdateConfiguration> {
    return this.http.post<addUpdateConfiguration>(`${this.postURL}`, data).pipe(this.retry);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.deleteURL}/${id}`).pipe(this.retry);
  }

}
