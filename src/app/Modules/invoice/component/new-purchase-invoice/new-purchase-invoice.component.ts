import { Component, OnInit } from '@angular/core';
import { AppService, FormBuilder, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

  publicVariable = new publicVariable();
  items: any[] = [
    { name: 'I phone 15 Pro Max', unit: '100', discount: '10', rate: '150000', amount: 0 }
  ];

  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder

  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.publicVariable.dataForm = this.fb.group({
      id: [''],
      invoiceType: ['Proforma Invoice', Validators.required],
      projectCode: ['', Validators.required],
      department: ['', Validators.required],
      division: ['', Validators.required],
      PANNo: ['', Validators.required],
      GSTNo: ['', Validators.required],
      PINO: [''],
      CustomerName: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      GSTNumber: ['', Validators.required],
      ContactPerson: ['', Validators.required],
      EmailID: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      items: this.fb.array([])


    });
    // Initialize items form array
    this.items.forEach(item => this.addItem(item));
  }

  ngOnInit(): void {

  }

  get itemsFormArray(): FormArray {
    return this.publicVariable.dataForm.get('items') as FormArray;
  }
  addItem(item?: any): void {
    item = item || { name: '', unit: '', discount: '', rate: '', amount: 0 };
    this.itemsFormArray.push(this.fb.group({
      name: [item.name, Validators.required],
      unit: [item.unit, Validators.required],
      discount: [item.discount, Validators.required],
      rate: [item.rate, Validators.required],
      amount: [this.calculateAmount(item), Validators.required]
    }));
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  calculateAmount(item: any): number {
    const unit = parseFloat(item.unit) || 0;
    const discount = parseFloat(item.discount) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = unit * rate * (1 - discount / 100);
    return isNaN(amount) ? 0 : amount;
  }

  calculateTotalAmount(): number {
    let total = 0;
    this.itemsFormArray.controls.forEach(control => {
      total += this.calculateAmount(control.value);
    });
    return total;
  }



  onSubmit(): void {
    if (this.publicVariable.dataForm.valid) {
      const newData = this.publicVariable.dataForm.value;
      const isUpdate = !!newData.id;
      // const selectedEmployee = this.publicVariable.employeeList.find(employee => employee.imeM_EmpId === newData.empId) || this.publicVariable.userData;

      // const newConfig: addUpdateEmployees = {
      //   isUpdate: isUpdate,
      //   imeM_ID: isUpdate ? newData.id : undefined,
      //   imeM_EmpId: newData.empId || this.publicVariable.userData.imeM_EmpId,
      //   imeM_Username: selectedEmployee.imeM_Username,
      //   imeM_Name: selectedEmployee.imeM_Name,
      //   imeM_Email: selectedEmployee.imeM_Email,
      //   roleId: newData.roleId,
      //   isActive: newData.isActive
      // };
      // const successMessage = isUpdate ? 'Data updated successfully.' : 'Data created successfully.';
      // this.handleApiRequest(this.API.create(newConfig), successMessage, 'Error submitting data:');
    } else {
      this.markFormControlsAsTouched();
    }
  }

  markFormControlsAsTouched(): void {
    ['invoiceType', 'projectCode', 'department', 'division', 'PANNo', 'GSTNo',
      'CustomerName', 'address', 'state', 'city', 'pincode', 'EmailID',
      'GSTNumber', 'ContactPerson', 'PhoneNo', 'items'].forEach(controlName => {
        this.publicVariable.dataForm.controls[controlName].markAsTouched();
      });
  }

  shouldShowError(controlName: string, errorName: string): boolean {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
}
