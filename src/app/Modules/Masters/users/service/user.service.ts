import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private RolesList = `${environment.apiURL}DropDown/GetRole` ;
  private EmployeeList = `${environment.apiURL}DropDown/GetEmployeeList` ;
  private  retry:any =  retry(1); // Retry the request up to 2 times in case of failure

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.RolesList}`).pipe(this.retry);
  }
  getEmployee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.EmployeeList}`).pipe(this.retry);
  }

}
