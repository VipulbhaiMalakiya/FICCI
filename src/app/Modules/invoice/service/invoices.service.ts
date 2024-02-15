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
  private Projectapi = `${environment.apiURL}Project/0` ;
  private  retry:any =  retry(1); // Retry the request up to 2 times in case of failure


  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.Projectapi}`).pipe(this.retry);
  }

  create(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })

    }).pipe(this.retry);
  }
  // delete(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(this.retry);
  // }
}
