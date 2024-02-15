import { Component, OnInit } from '@angular/core';
import { AppService, FormBuilder, NgbModal, Router, ToastrService, Validators, gstValidator, panValidator, publicVariable } from '../../Export/invoce';
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
      projectCode: ['', [Validators.required]],
      department:  ['', [Validators.required]],
      division:  ['', [Validators.required]],
      PANNo: ['', [Validators.required, panValidator()]], // Use the custom validator function
      GSTNo: ['', [Validators.required,gstValidator()]],
      PINO: [''],
      CustomerName:  ['', [Validators.required]],
      address:  ['', [Validators.required]],
      state:  ['', [Validators.required]],
      city:  ['', [Validators.required]],
      pincode:  ['', [Validators.required]],
      GSTNumber: ['',[ Validators.required,gstValidator()]],
      ContactPerson:  ['', [Validators.required]],
      EmailID: ['', [Validators.required, Validators.email]],
      PhoneNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],

      items: this.fb.array([]),
      file: [],
      PaymentTerms: [],
      Remarks: [],
    });
    // Initialize items form array
    this.items.forEach(item => this.addItem(item));
  }

  ngOnInit(): void {

  }

  onInputChange(event: any) {
    const inputValue = event.target.value; event.target.value = inputValue.replace(/[^0-9]/g, ''); // Allow only numeric input
  }
  onDiscountInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;    let numericValue = inputValue.replace(/[^0-9.]/g, ''); // Allow only numeric input and '.'
    const decimalParts = numericValue.split('.');
    if (decimalParts.length > 1 && decimalParts[1].length > 2) {
      numericValue = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
    }
    if (decimalParts[0].length > 2) {
      numericValue = numericValue.substring(0, 2) + '.' + numericValue.substring(2);
    }
    (event.target as HTMLInputElement).value = numericValue;

  }
  priceValidator(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    let numericValue = inputValue.replace(/[^0-9.]/g, '');
    const decimalParts = numericValue.split('.');
    if (decimalParts.length > 1) {
      const integerPart = decimalParts[0];
      const decimalPart = decimalParts[1].slice(0, 2);
      numericValue = integerPart + '.' + decimalPart;
    }

    (event.target as HTMLInputElement).value = numericValue;
  }

  get itemsFormArray(): FormArray {
    return this.publicVariable.dataForm.get('items') as FormArray;
  }
  addItem(item?: any): void {
    item = item || { name: '', unit: '', discount: '', rate: '', amount: 0 };
    this.itemsFormArray.push(this.fb.group({
      name: [item.name, Validators.required],
      unit: [item.unit, Validators.required],
      discount: [item.discount, [Validators.required, Validators.min(0), Validators.max(100)]],
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


      const newConfig: any = {
        isUpdate: isUpdate,
        // imeM_ID: isUpdate ? newData.id : undefined,
        invoiceType: newData.invoiceType,
        projectCode: newData.projectCode,
        department: newData.department,
        division: newData.division,
        PANNo: newData.PANNo,
        GSTNo: newData.GSTNo,
        PINO: newData.PINO,
        CustomerName: newData.CustomerName,
        address:newData.address,
        state:newData.state,
        city:newData.city,
        pincode:newData.pincode,
        GSTNumber:newData.GSTNumber,
        ContactPerson:newData.ContactPerson,
        EmailID:newData.EmailID,
        PhoneNo:newData.PhoneNo,
        items:newData.items,
        file:newData.file,
        PaymentTerms:newData.PaymentTerms,
        Remarks:newData.Remarks
      };
      // Check if invoiceType is Tax Invoice, then include PINO
      if (newData.invoiceType === 'Tax Invoice') {
        newConfig.PINO = newData.PINO;
      }

      console.log(newConfig);

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
