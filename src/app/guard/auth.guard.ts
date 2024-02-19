import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isLoggedIn()) {
            // Check if route is restricted by role
            const expectedRole = route.data['expectedRole']; // Access 'expectedRole' using ['expectedRole']
            if (expectedRole && this.authService.userRole !== expectedRole) {
                // Role not authorized, redirect to login page or unauthorized page
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
