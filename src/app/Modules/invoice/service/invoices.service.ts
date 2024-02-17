import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiURL}PurchaseInvoice_New` ;
  private Projectapi = `${environment.apiURL}DropDown/GetProject?id=0` ;
  private PurchaseInvoice_New = `${environment.apiURL}PurchaseInvoice_New?headerid=0` ;
  private  retry:any =  retry(1); // Retry the request up to 2 times in case of failure


  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.Projectapi}`).pipe(this.retry);
  }

  getPurchaseInvoice_New(): Observable<any[]> {
    return this.http.get<any[]>(`${this.PurchaseInvoice_New}`).pipe(this.retry);
  }

  create(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData).pipe(this.retry);
  }
  // delete(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(this.retry);
  // }
}
