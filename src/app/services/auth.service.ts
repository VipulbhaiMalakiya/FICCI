import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { remove } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private loggedIn = false;
    private userRole: string = '';
    private userEmail: string = '';

    private users = [
        { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
        { email: 'accounts@gmail.com', password: 'accounts', role: 'accounts' },
        { email: 'approver@gmail.com', password: 'approver', role: 'approver' },
        { email: 'employee@gmail.com', password: 'employee', role: 'employee' },
        // Add more dummy users as needed
    ];

    private loginTimeKey = 'loginTime';

    constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

    login(email: string, password: string): Observable<any> {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            const dummyData = { token: 'dummy-token', role: user.role };

            this.loggedIn = true;
            this.userRole = dummyData.role;
            this.userEmail = user.email;

            // Save login time to local storage
            const loginTime = new Date().getTime();
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem(this.loginTimeKey, loginTime.toString());
            localStorage.setItem('token', dummyData.token);

            return of(dummyData);
        } else {
            return of({ error: 'Invalid credentials' });
        }
    }

    logout(): void {
        this.loggedIn = false;
        localStorage.clear();
        this.toastr.success('Logged out successfully', 'Success');
        this.router.navigate(['/login']);
    }



    isLoggedIn(): boolean {
        // Check if user is logged in based on the presence of necessary items in local storage
        const storedRole = localStorage.getItem('userRole');
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('userEmail');
        const storedLoginTime = localStorage.getItem(this.loginTimeKey);

        // Check if all necessary items are present
        return storedRole !== null && storedToken !== null && storedLoginTime !== null && storedEmail !==null;
    }

}
