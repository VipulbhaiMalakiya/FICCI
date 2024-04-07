import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private loggedIn = false;
    private userRole: string = '';
    private userEmail: string = '';
    private apiUrl = `${environment.apiURL}UserAuth`;
    private navisionUrl = `${environment.apiURL}UserAuth`;


    constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    login(email: string, password: string): Observable<any> {
        const body = { email: email, password: password };
        return this.http.post(`${this.apiUrl}`, body).pipe(
            map((response: any) => {
                if (response && response.token) {
                    const userRole = response.roleName;
                    const userEmail = response.email;
                    const name =response.name;
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userName', name);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('department', response.department);
                    localStorage.setItem('IsFinance',response.invoice_IsFinanceApprover)
                    return { token: response.token, role: userRole };
                } else {
                    this.toastr.error('Invalid credentials', 'Error');
                    return { error: 'Invalid credentials' };
                }
            }),
            catchError(error => {
                this.toastr.error('An error occurred during login', 'Error');
                return of({ error: 'An error occurred during login' });
            })
        );
    }

    navisionlogin(email: string): Observable<any> {
        const body = { email: email,password: 'team@123' };
        return this.http.post(`${this.navisionUrl}`, body).pipe(
            map((response: any) => {
                if (response && response.token) {
                    const userRole = response.roleName;
                    const userEmail = response.email;
                    const name =response.name;
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userName', name);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('department', response.department);
                    localStorage.setItem('IsFinance',response.invoice_IsFinanceApprover)
                    return { token: response.token, role: userRole };
                } else {
                   // this.toastr.error('Invalid credentials', 'Error');
                    this.router.navigate(['/unauthorized']); // Redirect to the dashboard

                    return { error: 'Invalid credentials' };
                }
            }),
            catchError(error => {
               // this.toastr.error('An error occurred during login', 'Error');
                this.router.navigate(['/unauthorized']); // Redirect to the dashboard

                return of({ error: 'An error occurred during login' });
            })
        );
    }


    logout(): void {
        this.loggedIn = false;
        localStorage.clear();
        this.toastr.success('Logged out successfully', 'Success');
        this.router.navigate(['/']);
    }



    isLoggedIn(): boolean {
        // Check if user is logged in based on the presence of necessary items in local storage
        const storedRole = localStorage.getItem('userRole');
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('userEmail');

        // Check if all necessary items are present
        return storedRole !== null && storedToken !== null  && storedEmail !==null;
    }

}
