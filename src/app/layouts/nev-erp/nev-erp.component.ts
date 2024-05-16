import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-nev-erp',
    templateUrl: './nev-erp.component.html',
    styleUrls: ['./nev-erp.component.css']
})
export class NevErpComponent implements OnInit {
    error!: string;
    isProcess: boolean = false;
    email?: any;
    ISValid: boolean =false;
    constructor(private router: Router, private authService: AuthService,private route: ActivatedRoute) { }


    ngOnInit(): void {
        // Check if the email is stored in local storage

        this.route.queryParams.subscribe(params => {
            console.log(params['id']);
            this.email = atob(params['id']);
            console.log(this.email);
        });

       // this.email = this.route.snapshot.paramMap.get('id')
        this.isProcess = true;
        
        const storedEmail = this.email;
        if (storedEmail) {
            this.isProcess = true;
            this.authService.navisionlogin(storedEmail).subscribe(
                (response) => {
                    if (response.error) {
                        this.error = response.error;
                        this.isProcess = false;

                    } else {

                        this.ISValid =true;
                       // this.router.navigate(['/dashboard']); // Redirect to the dashboard
                        // this.toastr.success('Logged in successfully', 'Success');
                        this.isProcess = false;

                    }
                },
                (error) => {
                    this.isProcess = false;
                    // this.toastr.error('Login failed', 'Error')
                    this.router.navigate(['/unauthorized']); // Redirect to the dashboard

                }
            );


        } else {
            this.router.navigate(['/unauthorized']); // Redirect to the dashboard
            this.isProcess = false;
        }
    }


}
