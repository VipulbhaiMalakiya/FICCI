import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    dataForm!: FormGroup;
    hidePassword: boolean = true;
    error!: string;
    isProcess: boolean = false;



    constructor(private toastr: ToastrService,
        private router: Router, private fb: FormBuilder, private authService: AuthService) {
        this.initializeForm();
    }

    ngOnInit(): void {
        // Check if the email is stored in local storage
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            this.isProcess = true;
            this.authService.navisionlogin(storedEmail).subscribe(
                (response) => {
                    if (response.error) {
                        this.error = response.error;
                        this.isProcess = false;
                    } else {
                        this.router.navigate(['/dashboard']); // Redirect to the dashboard
                        this.toastr.success('Logged in successfully', 'Success');
                        this.isProcess = false;

                    }
                },
                (error) => {
                    this.isProcess = false;
                    this.toastr.error('Login failed', 'Error')
                    this.router.navigate(['/unauthorized']); // Redirect to the dashboard

                }
            );


        }else{
            this.router.navigate(['/unauthorized']); // Redirect to the dashboard

        }
    }

    private initializeForm(): void {
        this.dataForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        })
    }

    togglePasswordVisibility() {
        this.hidePassword = !this.hidePassword;
    }

    onSubmit() {
        if (this.dataForm.valid) {
            const { email, password } = this.dataForm.value;
            this.isProcess = true;
            this.authService.login(email, password).subscribe(
                (response) => {
                    if (response.error) {
                        this.error = response.error;
                        this.isProcess = false;
                    } else {
                        this.router.navigate(['/dashboard']); // Redirect to the dashboard
                        this.toastr.success('Logged in successfully', 'Success');
                        this.isProcess = false;

                    }
                },
                (error) => {
                    this.isProcess = false;
                    this.toastr.error('Login failed', 'Error')
                }
            );
        } else {
            this.markFormControlsAsTouched();
        }
    }

    markFormControlsAsTouched(): void {
        ['email', 'password'].forEach(controlName => {
            this.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.dataForm.controls[controlName].touched && this.dataForm.controls[controlName].hasError(errorName);
    }
}
