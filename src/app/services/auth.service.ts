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
    private autoLogoutTimer: any;
    // private autoLogoutDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    private autoLogoutDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {
        this.setupAutoLogoutEvents();
    }
    login(email: string, password: string): Observable<any> {
        const body = { email: email, password: password };
        const loginTime = new Date().toISOString();
        return this.http.post(`${this.apiUrl}`, body).pipe(
            map((responseData: any) => {

                console.log(responseData);
                if (responseData.status == "InvalidLogin") {
                    this.toastr.warning(responseData.message, "Warning");
                    return;
                }

                else if (responseData.status == "Unauthorized") {
                    this.toastr.warning(responseData.message, "Warning");
                    this.router.navigate(['/unauthorized']);
                    return;
                }


                //console.log(responseData);
                let response = responseData.data;
                if (response && response.token) {
                    const userRole = response.roleName;
                    const userEmail = response.email;
                    const name = response.name;
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userName', name);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('department', response.department);
                    localStorage.setItem('IsFinance', response.invoice_IsFinanceApprover)
                    localStorage.setItem('navDepartment', response.navDepartment);
                    localStorage.setItem('loginTime', loginTime); // Store login time
                    this.router.navigate(['/dashboard']); // Redirect to the dashboard
                    this.toastr.success('Logged in successfully', 'Success');
                    this.resetAutoLogoutTimer(); // Start the auto-logout timer
                    return { token: response.token, role: userRole };

                }

                else {

                    this.toastr.warning(responseData.message, "Warning");
                    // this.toastr.error('Invalid credentials', 'Error');
                    return { error: responseData.message };
                }
            }),

            catchError(error => {
                console.log(error);
                // if (error.error && error.error.message)
                // {
                //   this.toastr.warning(error.error.message, 'warning');

                // }
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
        const body = { email: email };
        const loginTime = new Date().toISOString();
        return this.http.post(`${this.navisionUrl}`, body).pipe(
            map((response: any) => {
                if (response && response.token) {
                    const userRole = response.roleName;
                    const userEmail = response.email;
                    const name = response.name;
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userName', name);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('department', response.department);
                    localStorage.setItem('IsFinance', response.invoice_IsFinanceApprover)
                    localStorage.setItem('navDepartment', response.navDepartment);
                    localStorage.setItem('loginTime', loginTime); // Store login time

                    // localStorage.setItem('navDepartmentNew', response.navDepartment1);

                    return { token: response.token, role: userRole };
                } else {
                    // this.toastr.error('Invalid credentials', 'Error');
                    this.router.navigate(['/unauthorized']); // Redirect to the dashboard

                    return { error: 'Invalid credentials' };
                }
            }),

            catchError(error => {
                console.log(error);
                if (error.error && error.error.message) {
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
    //     localStorage.clear();
    //     this.toastr.success('Logged out successfully', 'Success');
    //     this.router.navigate(['/']);
    // }

    logout(): void {
        this.loggedIn = false;
        localStorage.clear();
        this.toastr.success('Logged out successfully', 'Success');
        this.router.navigate(['/']).then(() => {
            window.location.reload();
        });
    }



    isLoggedIn(): boolean {
        // Check if user is logged in based on the presence of necessary items in local storage
        const storedRole = localStorage.getItem('userRole');
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('userEmail');

        // Check if all necessary items are present
        return storedRole !== null && storedToken !== null && storedEmail !== null;
    }

    private setupAutoLogoutEvents() {
        ['click', 'mousemove', 'keypress'].forEach(event => {
            window.addEventListener(event, () => this.resetAutoLogoutTimer());
        });
    }

    private resetAutoLogoutTimer() {
        if (this.autoLogoutTimer) {
            clearTimeout(this.autoLogoutTimer);
        }
        this.autoLogoutTimer = setTimeout(() => {
            this.logout();
        }, this.autoLogoutDuration); // 5 minutes
    }

}
