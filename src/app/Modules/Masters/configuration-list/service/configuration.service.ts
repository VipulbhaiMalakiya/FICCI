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

  private apiUrl = `${environment.apiURL}Configuration_CRUD` ;
  private categoryListUrl = `${environment.apiURL}Drp_CategoryList` ;

  constructor(private http: HttpClient) {}

  getCategoryList(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryListUrl).pipe(
      retry(1), // Retry the request up to 2 times in case of failure
    );
  }
  getAll(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(`${this.apiUrl}`);
  }

  create(data: addUpdateConfiguration): Observable<addUpdateConfiguration> {
    return this.http.post<addUpdateConfiguration>(`${this.apiUrl}`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/your_endpoint/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?C_ID=${id}`);
  }

}
