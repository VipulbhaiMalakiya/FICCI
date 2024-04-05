import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-nev-erp',
    templateUrl: './nev-erp.component.html',
    styleUrls: ['./nev-erp.component.css']
})
export class NevErpComponent {

    constructor(private router: Router,private authService: AuthService) { }

    redirectToHomePage() {

        localStorage.setItem('userEmail', 'vipul.malakiya@teamcomputers.com');
        this.router.navigate(['/dashboard']); // Redirect to the dashboard

    }
}
