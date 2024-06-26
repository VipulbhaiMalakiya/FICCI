import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent {
    storedRole: string = '';
    storedEmail: string = '';
    storeUsername: string = ''

    constructor(private authService: AuthService) { }


    ngOnInit(): void {
        this.storedRole = localStorage.getItem('userRole') ?? '';
        this.storedEmail = localStorage.getItem('userEmail') ?? '';
        this.storeUsername = localStorage.getItem('userName') ?? '';
    }

    logout(): void {
        this.authService.logout();
    }

}
