import { ChangeDetectorRef, Component } from '@angular/core';
import { publicVariable } from '../../Export/new-customer';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { panValidator } from '../../Validation/panValidator';
import { alphanumericWithSpacesValidator } from '../../Validation/alphanumericWithSpacesValidator';
import { gstValidator } from '../../Validation/gstValidator';
@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent {
  publicVariable = new publicVariable();
  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef,

  ) {
    this.initializeForm();
  }
  private initializeForm(): void {
    this.publicVariable.dataForm = this.fb.group({
      customerNo: [''],
      name: ['', [Validators.required, alphanumericWithSpacesValidator()]] ,// Use the custom validator function
      name2: ['', alphanumericWithSpacesValidator()],
      address: ['', Validators.required, ],
      address2: ['', ],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      GSTRegistrationNo: ['', [Validators.required, gstValidator()]],
      GSTCustomerType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      PrimaryContactNo: ['', Validators.required],
      contact: ['', Validators.required],
      PANNo: ['', [Validators.required, panValidator()]] // Use the custom validator function
    });
  }

  onInputChange(event: any) {
    const inputValue = event.target.value; event.target.value = inputValue.replace(/[^0-9]/g, ''); // Allow only numeric input
  }

  onSubmit(): void {
    if (this.publicVariable.dataForm.valid) {
      const newData = this.publicVariable.dataForm.value;
      const newConfig: any = {
        customerNo: newData.customerNo,
        name: newData.name.trim(),
        name2: newData.name2.trim(),
        address: newData.address.trim(),
        address2: newData.address2.trim(),
        country: newData.country,
        state: newData.state,
        city: newData.city,
        postCode: newData.postCode.trim(),
        GSTRegistrationNo: newData.GSTRegistrationNo.trim(),
        GSTCustomerType: newData.GSTCustomerType,
        email: newData.email.trim(),
        PrimaryContactNo: newData.PrimaryContactNo.trim(),
        contact: newData.contact.trim(),
        PANNo: newData.PANNo.trim()
      };
      console.log(newConfig);

    } else {
      this.markFormControlsAsTouched();
    }
  }

  markFormControlsAsTouched(): void {
    ['name', 'address', 'country', 'state', 'city', 'postCode', 'GSTRegistrationNo', 'GSTCustomerType', 'email', 'PrimaryContactNo', 'contact', 'PANNo'].forEach(controlName => {
      this.publicVariable.dataForm.controls[controlName].markAsTouched();
    });
  }

  shouldShowError(controlName: string, errorName: string): boolean {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
}
