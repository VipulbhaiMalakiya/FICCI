import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    dataForm!: FormGroup;
    hidePassword: boolean = true;
    error!: string;


    constructor(private toastr: ToastrService,
        private router: Router,private fb: FormBuilder, private authService: AuthService) {
        this.initializeForm();
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

            this.authService.login(email, password).subscribe(
                (response) => {
                    if (response.error) {
                        this.error = response.error;
                    } else {
                        this.authService.setLoggedIn(true);
                        this.authService.setUserRole(response.role);
                        // Redirect to home or desired route
                        this.router.navigate(['/dashboard']); // Redirect to the dashboard
                    }
                },
                (error) => {
                    console.error('Login failed', error);
                    this.error = 'Login failed';
                }
            );
        } else {
            this.markFormControlsAsTouched();
        }
    }

    markFormControlsAsTouched(): void {
        ['email','password'].forEach(controlName => {
                this.dataForm.controls[controlName].markAsTouched();
            });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.dataForm.controls[controlName].touched && this.dataForm.controls[controlName].hasError(errorName);
    }
}
