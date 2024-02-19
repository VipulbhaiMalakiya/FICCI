import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Check if user is logged in
        if (this.authService.isLoggedIn()) {
            // Get the expected roles from route data
            const expectedRoles = route.data['expectedRoles'] as string[];

            // Get the user's role
            const userRole =  localStorage.getItem('userRole') ?? ''

            // Check if the user's role matches any of the expected roles
            if (expectedRoles && expectedRoles.includes(userRole)) {
                return true; // Allow access
            } else {
                // Role not authorized, redirect to unauthorized page or login page
                this.router.navigate(['/unauthorized']);
                return false;
            }
        } else {
            // User is not logged in, redirect to login page
            this.router.navigate(['/login']);
            return false;
        }
    }
}


