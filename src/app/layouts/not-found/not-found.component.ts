import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
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
