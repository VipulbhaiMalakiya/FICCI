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
    private navisionUrl = `${environment.apiURL}UserAuth/LoginHRMS`;

    constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    login(email: string, password: string): Observable<any> {
        const body = { email: email, password: password };
        return this.http.post(`${this.apiUrl}`, body).pipe(
            map((responseData: any) => {

                 if(responseData.status =="InvalidLogin")
                {
                    this.toastr.warning(responseData.message,"Warning");
                    return;
                }

                 if(responseData.status =="Unauthorized")
                {
                    this.toastr.warning(responseData.message,"Warning");
                    this.router.navigate(['/unauthorized']);
                    return;
                }


                //console.log(responseData);
                let response= responseData.data;
                if (response && response.token) {
                    const userRole = response.roleName;
                    const userEmail = response.email;
                    const name =response.name;
                    sessionStorage.setItem('userRole', userRole);
                    sessionStorage.setItem('userEmail', userEmail);
                    sessionStorage.setItem('userName', name);
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('department', response.department);
                    sessionStorage.setItem('IsFinance',response.invoice_IsFinanceApprover)
                    sessionStorage.setItem('navDepartment', response.navDepartment);

                    return { token: response.token, role: userRole };
                }

                else
                {

                    this.toastr.warning(responseData.message,"Warning");
                   // this.toastr.error('Invalid credentials', 'Error');
                    return { error: responseData.message };
                }
            }),

            catchError(error => {
                console.log(error);
                if (error.error && error.error.message)
                {
                  this.toastr.warning(error.error.message, 'warning');

                }
                // else
                // {
                //   this.toastr.warning('Network error. Please check your internet connection.', 'warning');
                // }
                this.router.navigate(['/unauthorized']);
                return of({ error: 'An error occurred during login' });
              })

            // catchError(error => {
            //     //console.log(error);


            //      this.toastr.error(error.error.message,'Error');
            //     // return of({ error: 'An error occurred during login' });
            //     this.router.navigate(['/unauthorized']); // Redirect to the dashboard
            //     return of({ error: 'An error occurred during login' });
            // })
        );
    }

    navisionlogin(email: string): Observable<any> {
        const body = { email: email};
        return this.http.post(`${this.navisionUrl}`, body).pipe(
            map((response: any) => {
                if (response && response.token) {
                    const userRole = response.roleName;
                    const userEmail = response.email;
                    const name =response.name;
                    sessionStorage.setItem('userRole', userRole);
                    sessionStorage.setItem('userEmail', userEmail);
                    sessionStorage.setItem('userName', name);
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('department', response.department);
                    sessionStorage.setItem('IsFinance',response.invoice_IsFinanceApprover)
                    sessionStorage.setItem('navDepartment', response.navDepartment);
                   // sessionStorage.setItem('navDepartmentNew', response.navDepartment1);

                    return { token: response.token, role: userRole };
                } else {
                   // this.toastr.error('Invalid credentials', 'Error');
                    this.router.navigate(['/unauthorized']); // Redirect to the dashboard

                    return { error: 'Invalid credentials' };
                }
            }),

            catchError(error => {
                console.log(error);
                if (error.error && error.error.message)
                 {
                  this.toastr.warning(error.error.message, 'warning');

                }

                this.router.navigate(['/unauthorized']);
                return of({ error: 'An error occurred during login' });
              })

            // catchError(error => {
            //    // this.toastr.error('An error occurred during login', 'Error');
            //     this.router.navigate(['/unauthorized']); // Redirect to the dashboard

            //     return of({ error: 'An error occurred during login' });
            // })
        );
    }


    // logout(): void {
    //     this.loggedIn = false;
    //     sessionStorage.clear();
    //     this.toastr.success('Logged out successfully', 'Success');
    //     this.router.navigate(['/']);
    // }

    logout(): void {
        this.loggedIn = false;
        sessionStorage.clear();
        this.toastr.success('Logged out successfully', 'Success');
        this.router.navigate(['/']).then(() => {
            window.location.reload();
        });
    }



    isLoggedIn(): boolean {
        // Check if user is logged in based on the presence of necessary items in local storage
        const storedRole = sessionStorage.getItem('userRole');
        const storedToken = sessionStorage.getItem('token');
        const storedEmail = sessionStorage.getItem('userEmail');

        // Check if all necessary items are present
        return storedRole !== null && storedToken !== null  && storedEmail !==null;
    }

}
