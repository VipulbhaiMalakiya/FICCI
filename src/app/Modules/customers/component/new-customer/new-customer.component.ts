import { ChangeDetectorRef, Component } from '@angular/core';
import { publicVariable } from '../../Export/new-customer';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
      name: ['', Validators.required],
      name2: [''],
      address: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      GSTRegistrationNo: ['', Validators.required],
      GSTCustomerType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      PrimaryContactNo: ['', Validators.required],
      contact: ['', Validators.required],
      PANNo: ['', Validators.required],
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
        name: newData.name,
        name2: newData.name2,
        address: newData.address,
        address2: newData.address2,
        country: newData.country,
        state: newData.state,
        city: newData.city,
        postCode: newData.postCode,
        GSTRegistrationNo: newData.GSTRegistrationNo,
        GSTCustomerType: newData.GSTCustomerType,
        email: newData.email,
        PrimaryContactNo: newData.PrimaryContactNo,
        contact: newData.contact,
        PANNo: newData.PANNo
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
