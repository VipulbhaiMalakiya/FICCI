import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private apiUrl = `${environment.apiURL}/your_endpoint` ;
  private CategoryList = `${environment.apiURL}Drp_CategoryList` ;

  constructor(private http: HttpClient) {}

  getCategoryList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.CategoryList}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/your_endpoint`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/your_endpoint/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/your_endpoint`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/your_endpoint/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/your_endpoint/${id}`);
  }

}
