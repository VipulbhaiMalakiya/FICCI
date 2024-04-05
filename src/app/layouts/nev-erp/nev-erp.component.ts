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


        this.authService.login('vipul.malakiya@teamcomputers.com', 'team@123').subscribe(
            (response) => {
                if (response.error) {
                } else {
                    this.router.navigate(['/login']); // Redirect to the dashboard

                }
            },
            (error) => {

            }
        );

    }
}
