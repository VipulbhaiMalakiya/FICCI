import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private loggedIn = false;
    private userRole: string = '';
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        // Make API call to authenticate user and retrieve JWT token
        return this.http.post<any>('api/login', { username, password });
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
