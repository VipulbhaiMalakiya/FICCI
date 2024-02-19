import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private loggedIn = false;
    private userRole: string = '';

    private users = [
        { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
        { email: 'accounts@gmail.com', password: 'accounts', role: 'accounts' },
        { email: 'approver@gmail.com', password: 'approver', role: 'approver' },
        { email: 'employee@gmail.com', password: 'employee', role: 'employee' },
        // Add more dummy users as needed
    ];

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            const dummyData = { token: 'dummy-token', role: user.role };
            localStorage.setItem('token', dummyData.token);
            this.loggedIn = true;
            this.userRole = dummyData.role;
            return of(dummyData);
        } else {
            return of({ error: 'Invalid credentials' });
        }
    }

    logout(): void {
        // Clear token from local storage and update login status
        localStorage.removeItem('token');
        this.loggedIn = false;
        this.userRole = ''; // Clear user role by assigning an empty string
    }


      isLoggedIn(): boolean {
        // Check if user is logged in
        return this.loggedIn;
      }

      setLoggedIn(value: boolean): void {
        this.loggedIn = value;
      }

      getUserRole(): string {
        return this.userRole;
      }

      setUserRole(role: string): void {
        this.userRole = role;
      }
}
