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
      id: [''],
      customerNo: [null, Validators.required],
      Name: [null, Validators.required],
      username: [{ value: '', disabled: true }, , Validators.required],
      name: [{ value: '', disabled: true }, , Validators.required],
      email: [{ value: '', disabled: true }, , [Validators.required, Validators.email]],
      isActive: [true] // Assuming default value is true
    });
  }
}
