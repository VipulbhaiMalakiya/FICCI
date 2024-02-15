import { Component, OnInit } from '@angular/core';
import { AppService, FormBuilder, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';

@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

  publicVariable = new publicVariable();


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
      CustomerName:['', Validators.required],


    });
  }





  ngOnInit(): void {

  }

  //
  items: any[] = [
    { name: 'I phone 15 Pro Max', unit: '100', discount: '10', rate: '150000', amount: 0 }
  ];
  addRow(): void {
    this.items.push({ name: '', unit: '', discount: '', rate: '', amount: 0 });
  }
  removeRow(index: number): void {
    this.items.splice(index, 1);
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
    for (let item of this.items) {
      total += this.calculateAmount(item);
    }
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
    ['invoiceType', 'projectCode', 'department', 'division', 'PANNo', 'GSTNo','CustomerName'].forEach(controlName => {
      this.publicVariable.dataForm.controls[controlName].markAsTouched();
    });
  }

  shouldShowError(controlName: string, errorName: string): boolean {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
}
