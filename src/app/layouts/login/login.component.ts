import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    dataForm!: FormGroup;
    hidePassword: boolean = true;


    constructor(private toastr: ToastrService, private fb: FormBuilder,) {
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
            // Here you can implement your login logic, such as sending the form data to a server
            console.log('Form submitted!', this.dataForm.value);
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
