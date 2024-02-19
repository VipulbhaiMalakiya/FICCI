import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isLoggedIn = localStorage.getItem('token') !== null;
        if (isLoggedIn) {
            const expectedRole = route.data['expectedRole'] as string;
            const userRole = localStorage.getItem('userRole');
            if (expectedRole && userRole !== expectedRole) {
                // Role not authorized, redirect to unauthorized page
                this.router.navigate(['/unauthorized']);
                return false;
            }
            return true;
        } else {
            // User is not logged in, redirect to login page
            this.router.navigate(['/login']);
            return false;
        }
    }

}
